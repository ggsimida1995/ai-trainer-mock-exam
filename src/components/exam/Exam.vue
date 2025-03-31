<template>
  <div class="exam-c">
    <div class="exam-container">
      <div class="nav-bar">
        <div class="back-button" @click="handleBack('left')">
          <span class="back-icon">←</span>
          <span>返回</span>
        </div>
      </div>
      <div class="exam-header">
        <div class="title-wrapper">
          <h2>考试</h2>
        </div>
        <div class="progress">
          剩余时间: {{ formatTime(remainingTime) }}
        </div>
      </div>

      <div class="content-wrapper">
        <div v-if="!isFinished" class="question-container">
          <div class="question-content">
            <div class="question-header">
              <span class="question-type">{{ getQuestionTypeText(currentQuestion?.type) }}</span>
              <span class="question-index">第 {{ currentIndex + 1 }}/{{ totalQuestions }} 题</span>
            </div>
            <div class="question-text">{{ currentQuestion?.question }}</div>
            <div class="options-container">
              <div v-for="(option, index) in currentQuestion?.options" 
                   :key="index"
                   class="option-item"
                   :class="{ 
                     'selected': userAnswers[currentIndex] === option,
                     'multi-selected': currentQuestion?.type === 'multi' && userAnswers[currentIndex]?.includes(option)
                   }"
                   @click="selectAnswer(option)">
                <span class="option-label">{{ getOptionLabel(index) }}.</span>
                <span class="option-text">{{ option }}</span>
              </div>
            </div>
          </div>
          <div class="question-nav">
            <button 
              class="nav-btn prev" 
              :disabled="currentIndex === 0"
              @click="prevQuestion">
              上一题
            </button>
            <button 
              class="nav-btn next" 
              :disabled="currentIndex === totalQuestions - 1"
              @click="nextQuestion">
              下一题
            </button>
            <button 
              class="nav-btn submit" 
              v-if="currentIndex === totalQuestions - 1"
              @click="submitExam">
              提交试卷
            </button>
          </div>
        </div>

        <div v-else class="result-container">
          <h2>考试完成</h2>
          <div class="time-used">
            用时：{{ formatTimeUsed(2700 - remainingTime) }}
          </div>
          <div class="score">
            得分: {{ score }}/100
          </div>
          <div class="score-detail">
            <div class="score-item">
              <span>判断题：</span>
              <span class="correct">{{ judgeScore }}/30</span>
            </div>
            <div class="score-item">
              <span>单选题：</span>
              <span class="correct">{{ singleScore }}/50</span>
            </div>
            <div class="score-item">
              <span>多选题：</span>
              <span class="correct">{{ multiScore }}/20</span>
            </div>
            <div class="score-item">
              <span>正确率：</span>
              <span class="rate">{{ (score / 100 * 100).toFixed(1) }}%</span>
            </div>
          </div>
          <div class="wrong-questions" v-if="wrongQuestions.length > 0">
            <h3>错题统计</h3>
            <p>共有 {{ wrongQuestions.length }} 道错题</p>
            <button class="view-wrong-btn" @click="viewWrongQuestions">查看错题</button>
          </div>
          <button class="restart-btn" @click="restartExam">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { QuestionBank, Question } from '../../types/question'
import questionData from '@/static/testQuestions.json'

const router = useRouter()

const questionBank = ref<QuestionBank>(questionData)
const currentIndex = ref(0)
const isFinished = ref(false)
const userAnswers = ref<(string | string[])[]>([])
const remainingTime = ref(2700) // 45分钟考试时间
let timer: ReturnType<typeof setInterval> | null = null

// 随机选择题目
const getRandomQuestions = () => {
  const questions: Question[] = []
  
  // 随机选择30道判断题
  const judgePool = [...questionBank.value.judgeQuestions]
  for (let i = 0; i < 30; i++) {
    const randomIndex = Math.floor(Math.random() * judgePool.length)
    questions.push({ ...judgePool[randomIndex], type: 'judge' })
    judgePool.splice(randomIndex, 1)
  }
  
  // 随机选择50道单选题
  const singlePool = [...questionBank.value.singleQuestions]
  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * singlePool.length)
    questions.push({ ...singlePool[randomIndex], type: 'single' })
    singlePool.splice(randomIndex, 1)
  }
  
  // 随机选择10道多选题
  const multiPool = [...questionBank.value.multiQuestions]
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * multiPool.length)
    questions.push({ ...multiPool[randomIndex], type: 'multi' })
    multiPool.splice(randomIndex, 1)
  }
  
  return questions
}

const examQuestions = ref<Question[]>([])
const currentQuestion = computed(() => examQuestions.value[currentIndex.value])
const totalQuestions = computed(() => examQuestions.value.length)

// 计算各类型题目得分
const judgeScore = computed(() => {
  return examQuestions.value
    .filter(q => q.type === 'judge')
    .reduce((acc, question, index) => {
      const answer = userAnswers.value[getQuestionIndexByType('judge', index)]
      return acc + (question.answer === answer ? 1 : 0)
    }, 0)
})

const singleScore = computed(() => {
  return examQuestions.value
    .filter(q => q.type === 'single')
    .reduce((acc, question, index) => {
      const answer = userAnswers.value[getQuestionIndexByType('single', index)]
      return acc + (question.answer === answer ? 1 : 0)
    }, 0)
})

const multiScore = computed(() => {
  return examQuestions.value
    .filter(q => q.type === 'multi')
    .reduce((acc, question, index) => {
      const answer = userAnswers.value[getQuestionIndexByType('multi', index)]
      return acc + (question.answer === answer ? 2 : 0)
    }, 0)
})

// 计算总分
const score = computed(() => {
  return judgeScore.value + singleScore.value + multiScore.value
})

// 根据题型和索引获取题目在总题目中的索引
const getQuestionIndexByType = (type: string, typeIndex: number) => {
  let count = 0
  for (let i = 0; i < examQuestions.value.length; i++) {
    if (examQuestions.value[i].type === type) {
      if (count === typeIndex) return i
      count++
    }
  }
  return -1
}

const getQuestionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'judge': '判断题',
    'single': '单选题',
    'multi': '多选题'
  }
  return typeMap[type] || type
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const selectAnswer = (answer: string) => {
  if (currentQuestion.value?.type === 'multi') {
    const currentAnswers = userAnswers.value[currentIndex.value] as string[] || []
    const index = currentAnswers.indexOf(answer)
    if (index === -1) {
      currentAnswers.push(answer)
    } else {
      currentAnswers.splice(index, 1)
    }
    userAnswers.value[currentIndex.value] = currentAnswers
  } else {
    userAnswers.value[currentIndex.value] = answer
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
  }
}

const submitExam = () => {
  isFinished.value = true
  if (timer) {
    clearInterval(timer)
  }

  // 计算错题
  const wrongQuestions = examQuestions.value.filter((question, index) => {
    const userAnswer = userAnswers.value[index]
    return question.answer !== userAnswer
  })

  // 创建考试记录
  const examRecord = {
    date: Date.now(),
    score: score.value,
    timeUsed: 2700 - remainingTime.value, // 修改为45分钟
    wrongCount: wrongQuestions.length,
    wrongQuestions: wrongQuestions,
    userAnswers: userAnswers.value
  }

  // 获取现有考试记录
  const storedExams = localStorage.getItem('examRecords')
  const examRecords = storedExams ? JSON.parse(storedExams) : []
  
  // 添加新的考试记录
  examRecords.push(examRecord)
  
  // 保存到 localStorage
  localStorage.setItem('examRecords', JSON.stringify(examRecords))
}

const restartExam = () => {
  currentIndex.value = 0
  isFinished.value = false
  userAnswers.value = []
  remainingTime.value = 2700 // 修改为45分钟
  examQuestions.value = getRandomQuestions()
  if (timer) {
    clearInterval(timer)
  }
  startTimer()
}

const startTimer = () => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      submitExam()
    }
  }, 1000)
}

const getOptionLabel = (index: number) => {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  return labels[index] || String(index + 1)
}

// 计算错题
const wrongQuestions = computed(() => {
  return examQuestions.value.filter((question, index) => {
    const userAnswer = userAnswers.value[index]
    return question.answer !== userAnswer
  })
})

// 格式化用时
const formatTimeUsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}时${minutes}分${remainingSeconds}秒`
}

// 查看错题
const viewWrongQuestions = () => {
  // 保存错题和用户答案到 localStorage
  localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions.value))
  localStorage.setItem('wrongQuestionAnswers', JSON.stringify(userAnswers.value))
  // 跳转到错题页面
  router.push('/wrong-questions')
}

// 添加页面刷新和关闭的确认提示
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (!isFinished.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

// 添加路由离开确认
onBeforeRouteLeave((to, from, next) => {
  if (!isFinished.value) {
    if (confirm('确定要离开考试吗？离开后考试进度将不会保存。')) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// 修改返回按钮的处理函数
const handleBack = (position: 'left' | 'right') => {
  router.push('/')
}

onMounted(() => {
  examQuestions.value = getRandomQuestions()
  startTimer()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.exam-c {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.exam-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 25px 35px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.back-button.right {
  flex-direction: row-reverse;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(-2px);
}

.back-button.right:hover {
  transform: translateX(2px);
}

.back-icon {
  font-size: 20px;
  color: #2c3e50;
}

.back-button span {
  color: #2c3e50;
  font-weight: 500;
}

.title-wrapper {
  position: relative;
}

.exam-header h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.exam-header h2::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border-radius: 2px;
}

.progress {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.content-wrapper {
  flex: 1;
  display: flex;
}

.question-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.question-content {
  flex: 1;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.question-type {
  font-size: 18px;
  font-weight: 600;
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  padding: 6px 12px;
  border-radius: 15px;
}

.question-index {
  font-size: 16px;
  color: #7f8c8d;
}

.question-text {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 30px;
  line-height: 1.6;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option-item:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(5px);
}

.option-item.selected {
  background: rgba(52, 152, 219, 0.1);
  border-color: #3498db;
}

.option-item.multi-selected {
  background: rgba(52, 152, 219, 0.1);
  border-color: #3498db;
}

.option-label {
  font-weight: 600;
  color: #3498db;
}

.option-text {
  color: #2c3e50;
  flex: 1;
}

.question-nav {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.prev {
  background: #95a5a6;
  color: white;
}

.nav-btn.next {
  background: #3498db;
  color: white;
}

.nav-btn.submit {
  background: #2ecc71;
  color: white;
}

.result-container {
  text-align: center;
  padding: 50px 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-container h2 {
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.time-used {
  font-size: 20px;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.score {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 700;
}

.score-detail {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
}

.score-item span:first-child {
  color: #7f8c8d;
  font-size: 16px;
}

.score-item .correct {
  color: #2ecc71;
  font-size: 24px;
  font-weight: 600;
}

.score-item .rate {
  color: #3498db;
  font-size: 24px;
  font-weight: 600;
}

.wrong-questions {
  margin: 30px 0;
  padding: 20px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 15px;
}

.wrong-questions h3 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.wrong-questions p {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.view-wrong-btn {
  background: #e74c3c;
  margin-bottom: 20px;
}

.restart-btn {
  background: linear-gradient(45deg, #3498db, #2ecc71);
}

button {
  padding: 12px 24px;
  font-size: 18px;
  color: white;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

@media screen and (max-width: 768px) {
  .exam-container {
    padding: 10px;
  }

  .exam-header {
    padding: 15px 20px;
    margin-bottom: 20px;
  }

  .exam-header h2 {
    font-size: 24px;
  }

  .progress {
    font-size: 16px;
    padding: 8px 16px;
  }

  .question-container {
    padding: 20px;
  }

  .question-text {
    font-size: 18px;
  }

  .option-item {
    padding: 12px 15px;
  }

  .result-container {
    padding: 30px 20px;
  }

  .result-container h2 {
    font-size: 24px;
  }

  .score {
    font-size: 28px;
  }

  .score-detail {
    flex-direction: row;
    gap: 15px;
    justify-content: center;
  }

  .score-item {
    flex: 0 0 calc(50% - 10px);
    min-width: auto;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
  }
}
</style> 