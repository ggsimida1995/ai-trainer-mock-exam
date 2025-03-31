<template>
  <div class="practice-home-container">
    <div class="nav-bar">
      <div class="back-button" @click="router.back()">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
    </div>
    <div class="content-wrapper">
      <h1>练习模式</h1>
      <p class="subtitle">选择您想要练习的题目类型</p>
      <div class="practice-grid">
        <router-link to="/judge" class="practice-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-check-circle"></i>
            </div>
            <h2>判断题练习</h2>
            <p>练习判断题，提高判断能力</p>
          </div>
        </router-link>
        
        <router-link to="/single" class="practice-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-dot-circle"></i>
            </div>
            <h2>单选题练习</h2>
            <p>练习单选题，提升选择能力</p>
          </div>
        </router-link>
        
        <router-link to="/multi" class="practice-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-tasks"></i>
            </div>
            <h2>多选题练习</h2>
            <p>练习多选题，增强综合能力</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.practice-home-container {
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

.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  padding: 20px;
}

.practice-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.practice-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.card-content {
  text-align: center;
}

.icon-wrapper {
  margin-bottom: 20px;
}

.icon-wrapper i {
  font-size: 2.5em;
  color: #3498db;
  transition: color 0.3s ease;
}

.practice-card:hover .icon-wrapper i {
  color: #2980b9;
}

.card-content h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5em;
  font-weight: 600;
}

.card-content p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
  font-size: 1.1em;
}

@media screen and (max-width: 768px) {
  .practice-home-container {
    padding: 20px 10px;
  }

  h1 {
    font-size: 2em;
  }

  .subtitle {
    font-size: 1.1em;
    margin-bottom: 30px;
  }

  .practice-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }

  .practice-card {
    padding: 25px;
  }

  .icon-wrapper i {
    font-size: 2em;
  }

  .card-content h2 {
    font-size: 1.3em;
  }

  .card-content p {
    font-size: 1em;
  }
}
</style>