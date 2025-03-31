<template>
  <div class="wrong-questions-page">
    <div class="nav-bar">
      <div class="back-button" @click="router.push('/')">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
      <h2>错题集</h2>
    </div>

    <!-- 考试列表视图 -->
    <div v-if="!selectedExam" class="exam-list-container">
      <div class="exam-list">
        <div v-for="(exam, index) in examList" 
             :key="index"
             class="exam-card"
             @click="viewExamDetails(exam)">
          <div class="exam-info">
            <div class="exam-date">{{ formatDate(exam.date) }}</div>
            <div class="exam-score">
              <span class="score">{{ exam.score }}</span>
              <span class="total">/ 100</span>
            </div>
          </div>
          <div class="exam-stats">
            <div class="stat-item">
              <span class="label">错题数：</span>
              <span class="value">{{ exam.wrongCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">用时：</span>
              <span class="value">{{ formatTimeUsed(exam.timeUsed) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错题详情视图 -->
    <div v-else class="questions-container">
      <div class="exam-summary">
        <div class="summary-item">
          <span class="label">考试时间：</span>
          <span class="value">{{ formatDate(selectedExam.date) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">得分：</span>
          <span class="value">{{ selectedExam.score }}/100</span>
        </div>
        <div class="summary-item">
          <span class="label">用时：</span>
          <span class="value">{{ formatTimeUsed(selectedExam.timeUsed) }}</span>
        </div>
        <button class="back-to-list" @click="backToList">返回列表</button>
      </div>

      <div v-for="(question, index) in wrongQuestions" 
           :key="question.id" 
           class="question-card">
        <div class="question-header">
          <span class="question-type">{{ getQuestionTypeText(question.type) }}</span>
          <span class="question-index">第 {{ index + 1 }}/{{ wrongQuestions.length }} 题</span>
        </div>
        
        <div class="question-content">
          <div class="question-text">{{ question.question }}</div>
          
          <div class="options-container">
            <div v-for="(option, optIndex) in question.options" 
                 :key="optIndex"
                 class="option-item"
                 :class="{
                   'correct': question.answer === option || 
                            (Array.isArray(question.answer) && question.answer.includes(option)),
                   'wrong': userAnswers[index] === option || 
                           (Array.isArray(userAnswers[index]) && userAnswers[index].includes(option))
                 }">
              <span class="option-label">{{ getOptionLabel(optIndex) }}.</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>

          <div class="explanation" v-if="question.explanation">
            <h4>解析：</h4>
            <p>{{ question.explanation }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Question } from '../../types/question'

const router = useRouter()

interface ExamRecord {
  date: number
  score: number
  timeUsed: number
  wrongCount: number
  wrongQuestions: Question[]
  userAnswers: (string | string[])[]
}

// 考试列表数据
const examList = ref<ExamRecord[]>([])
const selectedExam = ref<ExamRecord | null>(null)
const wrongQuestions = ref<Question[]>([])
const userAnswers = ref<(string | string[])[]>([])

onMounted(() => {
  // 从 localStorage 获取考试记录
  const storedExams = localStorage.getItem('examRecords')
  if (storedExams) {
    examList.value = JSON.parse(storedExams)
  }
})

const viewExamDetails = (exam: ExamRecord) => {
  selectedExam.value = exam
  wrongQuestions.value = exam.wrongQuestions
  userAnswers.value = exam.userAnswers
}

const backToList = () => {
  selectedExam.value = null
  wrongQuestions.value = []
  userAnswers.value = []
}

const getQuestionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'judge': '判断题',
    'single': '单选题',
    'multi': '多选题'
  }
  return typeMap[type] || type
}

const getOptionLabel = (index: number) => {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  return labels[index] || String(index + 1)
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const formatTimeUsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours}时${minutes}分${remainingSeconds}秒`
}
</script>

<style scoped>
.wrong-questions-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  box-sizing: border-box;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(-2px);
}

.back-icon {
  font-size: 20px;
  color: #2c3e50;
}

.back-button span {
  color: #2c3e50;
  font-weight: 500;
}

.nav-bar h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  flex: 1;
  text-align: center;
}

/* 考试列表样式 */
.exam-list-container {
  max-width: 800px;
  margin: 0 auto;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.exam-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.exam-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.exam-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.exam-date {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 500;
}

.exam-score {
  font-size: 24px;
  color: #2c3e50;
}

.exam-score .score {
  color: #3498db;
  font-weight: 600;
}

.exam-score .total {
  color: #7f8c8d;
  font-size: 18px;
}

.exam-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-item .label {
  color: #7f8c8d;
}

.stat-item .value {
  color: #2c3e50;
  font-weight: 500;
}

/* 错题详情样式 */
.exam-summary {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-item .label {
  color: #7f8c8d;
}

.summary-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.back-to-list {
  padding: 8px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-list:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.questions-container {
  max-width: 800px;
  margin: 0 auto;
}

.question-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
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
  margin-bottom: 25px;
  line-height: 1.6;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.option-item.correct {
  background: rgba(46, 204, 113, 0.1);
  border-color: #2ecc71;
}

.option-item.wrong {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

.option-label {
  font-weight: 600;
  color: #3498db;
}

.option-text {
  color: #2c3e50;
  flex: 1;
}

.explanation {
  background: rgba(52, 152, 219, 0.1);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}

.explanation h4 {
  color: #3498db;
  margin: 0 0 10px 0;
  font-size: 18px;
}

.explanation p {
  color: #2c3e50;
  margin: 0;
  line-height: 1.6;
}

@media screen and (max-width: 768px) {
  .wrong-questions-page {
    padding: 10px;
  }

  .exam-card {
    padding: 20px;
  }

  .exam-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .exam-stats {
    flex-direction: column;
    gap: 10px;
  }

  .exam-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .question-card {
    padding: 20px;
  }

  .question-text {
    font-size: 18px;
  }

  .option-item {
    padding: 12px 15px;
  }
}
</style> 