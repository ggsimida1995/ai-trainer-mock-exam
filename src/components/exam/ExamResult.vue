<template>
  <div class="result-container">
    <div class="nav-bar">
      <div class="back-button" @click="router.push('/')">
        <span class="back-icon">←</span>
        <span>返回首页</span>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="score-card">
        <div class="score-circle">
          <div class="score-number">{{ score }}</div>
          <div class="total-score">/ 100</div>
        </div>
        <div class="score-details">
          <div class="detail-item">
            <span>判断题</span>
            <span>{{ judgeCorrect }}/20题</span>
          </div>
          <div class="detail-item">
            <span>单选题</span>
            <span>{{ singleCorrect }}/60题</span>
          </div>
          <div class="detail-item">
            <span>多选题</span>
            <span>{{ multiCorrect }}/10题</span>
          </div>
        </div>
        <div class="pass-status" :class="{ 'passed': isPassed }">
          {{ isPassed ? '恭喜通过！' : '继续加油！' }}
        </div>
      </div>

      <div class="analysis-section">
        <h2>答题分析</h2>
        <div class="analysis-grid">
          <div class="analysis-card">
            <div class="icon-wrapper">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="analysis-title">正确题数</div>
            <div class="analysis-number">{{ correctCount }}</div>
          </div>
          <div class="analysis-card">
            <div class="icon-wrapper">
              <i class="fas fa-times-circle"></i>
            </div>
            <div class="analysis-title">错误题数</div>
            <div class="analysis-number">{{ wrongCount }}</div>
          </div>
          <div class="analysis-card">
            <div class="icon-wrapper">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="analysis-title">正确率</div>
            <div class="analysis-number">{{ correctRate }}%</div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="retry-btn" @click="retryExam">
          <i class="fas fa-redo"></i>
          重新考试
        </button>
        <button class="review-btn" @click="reviewAnswers">
          <i class="fas fa-search"></i>
          查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 从路由参数获取考试结果数据
const examData = route.params.examData || {
  score: 0,
  judgeCorrect: 0,
  singleCorrect: 0,
  multiCorrect: 0,
  answers: []
}

const score = computed(() => examData.score)
const judgeCorrect = computed(() => examData.judgeCorrect)
const singleCorrect = computed(() => examData.singleCorrect)
const multiCorrect = computed(() => examData.multiCorrect)

const isPassed = computed(() => score.value >= 60)
const correctCount = computed(() => judgeCorrect.value + singleCorrect.value + multiCorrect.value)
const wrongCount = computed(() => 90 - correctCount.value)
const correctRate = computed(() => Math.round((correctCount.value / 90) * 100))

const retryExam = () => {
  router.push('/exam/test')
}

const reviewAnswers = () => {
  // TODO: 实现答题详情查看功能
  console.log('查看答题详情')
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.nav-bar {
  margin-bottom: 30px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(-5px);
}

.back-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.score-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.score-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #f8f9fa;
  margin: 0 auto 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.score-number {
  font-size: 4em;
  font-weight: bold;
  color: #2c3e50;
}

.total-score {
  color: #7f8c8d;
  font-size: 1.2em;
}

.score-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item span:first-child {
  color: #7f8c8d;
}

.detail-item span:last-child {
  font-weight: bold;
  color: #2c3e50;
}

.pass-status {
  font-size: 1.5em;
  font-weight: bold;
  color: #e74c3c;
}

.pass-status.passed {
  color: #27ae60;
}

.analysis-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.analysis-section h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.analysis-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.icon-wrapper {
  margin-bottom: 15px;
}

.icon-wrapper i {
  font-size: 2em;
  color: #3498db;
}

.analysis-title {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.analysis-number {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-buttons button {
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.retry-btn {
  background: #3498db;
  color: white;
}

.retry-btn:hover {
  background: #2980b9;
}

.review-btn {
  background: #2ecc71;
  color: white;
}

.review-btn:hover {
  background: #27ae60;
}

@media screen and (max-width: 768px) {
  .result-container {
    padding: 20px 10px;
  }

  .score-circle {
    width: 150px;
    height: 150px;
  }

  .score-number {
    font-size: 3em;
  }

  .score-details {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>