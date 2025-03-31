<template>
  <div class="exam-home-container">
    <div class="nav-bar">
      <div class="back-button" @click="router.back()">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
    </div>
    <div class="content-wrapper">
      <h1>考试模式</h1>
      <p class="subtitle">开始正式考试，检验您的学习成果</p>
      <div class="exam-info">
        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-clock"></i>
          </div>
          <h3>考试时长</h3>
          <p>45分钟</p>
        </div>
        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-question-circle"></i>
          </div>
          <h3>题目数量</h3>
          <p>90题(判断 30题 单选 50题 多选 10题)</p>
        </div>
        <div class="info-card">
          <div class="icon-wrapper">
            <i class="fas fa-star"></i>
          </div>
          <h3>及格分数</h3>
          <p>90分</p>
        </div>
      </div>
      <div class="start-exam-wrapper">
        <button class="start-exam-btn" @click="startExam">
          <i class="fas fa-play-circle"></i>
          开始考试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startExam = () => {
  router.push('/exam/test')
}
</script>

<style scoped>
.exam-home-container {
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2.5em;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  text-align: center;
  color: #34495e;
  margin-bottom: 40px;
  font-size: 1.2em;
}

.exam-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  padding: 0 20px;
}

.info-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.icon-wrapper {
  margin-bottom: 20px;
}

.icon-wrapper i {
  font-size: 2.5em;
  color: #3498db;
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.info-card p {
  color: #7f8c8d;
  font-size: 1.2em;
  font-weight: 600;
}

.start-exam-wrapper {
  text-align: center;
  margin-top: 40px;
}

.start-exam-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2em;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.start-exam-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.start-exam-btn i {
  font-size: 1.2em;
}

@media screen and (max-width: 768px) {
  .exam-home-container {
    padding: 20px 10px;
  }

  h1 {
    font-size: 2em;
  }

  .subtitle {
    font-size: 1.1em;
    margin-bottom: 30px;
  }

  .exam-info {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 10px;
  }

  .info-card {
    padding: 25px;
  }

  .icon-wrapper i {
    font-size: 2em;
  }

  .info-card h3 {
    font-size: 1.2em;
  }

  .info-card p {
    font-size: 1.1em;
  }

  .start-exam-btn {
    padding: 12px 30px;
    font-size: 1.1em;
  }
}
</style>