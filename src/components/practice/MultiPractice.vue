<template>
   <div class="practice-c">
  <div class="practice-container">
    <div class="nav-bar">
      <div class="back-button" @click="router.back()">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
    </div>
    <div class="practice-header">
      <div class="title-wrapper">
        <h2>多选题练习</h2>
      </div>
      <div class="progress">
        已完成: {{ completedCount }}/{{ totalQuestions }}
      </div>
    </div>

    <div class="content-wrapper">
      <div v-if="!isFinished" class="question-container">
        <QuestionCard
          :question="currentQuestion"
          :show-result="showResult"
          @answer="handleAnswer"
          @next="nextQuestion"
        />
      </div>

    <div v-else class="result-container">
      <h2>练习完成</h2>
      <div class="score">
        得分: {{ score }}/{{ totalQuestions }}
      </div>
      <button @click="restartPractice">重新开始</button>
    </div>
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { QuestionBank, Question } from '../../types/question'
import QuestionCard from './QuestionCard.vue'
import questionData from '@/static/testQuestions.json'

const router = useRouter()

const questionBank = ref<QuestionBank>(questionData)
const currentIndex = ref(0)
const isFinished = ref(false)
const showResult = ref(false)

const multiQuestions = computed(() => questionBank.value.multiQuestions)
const currentQuestion = computed(() => multiQuestions.value[currentIndex.value])
const totalQuestions = computed(() => multiQuestions.value.length)
const completedCount = computed(() => currentIndex.value)

const score = computed(() => {
  return multiQuestions.value.reduce((acc: number, question: Question) => {
    return acc + (JSON.stringify(question.answer) === JSON.stringify(question.userAnswer) ? 1 : 0)
  }, 0)
})

const handleAnswer = (answer: string | string[]) => {
  if (currentQuestion.value) {
    currentQuestion.value.userAnswer = Array.isArray(answer) ? answer : [answer]
  }
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
    showResult.value = false
    if (currentQuestion.value) {
      currentQuestion.value.userAnswer = []
    }
  } else {
    isFinished.value = true
  }
}

const restartPractice = () => {
  currentIndex.value = 0
  isFinished.value = false
  showResult.value = false
  multiQuestions.value.forEach((question: Question) => {
    question.userAnswer = []
  })
}

onBeforeRouteLeave(() => {
  restartPractice()
})
</script>

<style scoped>
.practice-c {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.practice-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 20px;
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

.practice-header {
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

.title-wrapper {
  position: relative;
}

.practice-header h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.practice-header h2::after {
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
  height: calc(100vh - 200px);
  display: flex;
  overflow-y: auto;
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
}

.question-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
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

.score {
  font-size: 36px;
  color: #2c3e50;
  margin: 30px 0;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

button {
  padding: 12px 30px;
  font-size: 18px;
  background: linear-gradient(45deg, #3498db, #2ecc71);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
  background: linear-gradient(45deg, #2ecc71, #3498db);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 768px) {
  .practice-container {
    padding: 15px;
  }

  .practice-header {
    padding: 20px;
    margin-bottom: 30px;
    flex-direction: column;
    gap: 15px;
  }

  .practice-header h2 {
    font-size: 26px;
  }

  .progress {
    font-size: 16px;
    padding: 10px 20px;
  }

  .question-container {
    padding: 20px;
  }
}
</style>