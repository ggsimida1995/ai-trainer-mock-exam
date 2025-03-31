<template>
  <div class="home-container">
    <div class="content-wrapper">
      <h1>人工智能训练师在线练习系统</h1>
      <p class="subtitle">选择您想要进入的模块</p>
      <div class="module-grid">
        <router-link to="/practice" class="module-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-book-open"></i>
            </div>
            <h2>练习模式</h2>
            <p>包含判断题、单选题、多选题等多种练习类型</p>
          </div>
        </router-link>
        
        <router-link to="/exam" class="module-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <h2>考试模式</h2>
            <p>正式考试，全面检验学习成果</p>
          </div>
        </router-link>

        <router-link to="/wrong-questions" class="module-card">
          <div class="card-content">
            <div class="icon-wrapper">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <h2>错题集</h2>
            <p>查看历史错题，查漏补缺</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
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

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  padding: 20px;
}

.module-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.module-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.card-content {
  text-align: center;
}

.icon-wrapper {
  margin-bottom: 25px;
}

.icon-wrapper i {
  font-size: 3em;
  color: #3498db;
  transition: color 0.3s ease;
}

.module-card:hover .icon-wrapper i {
  color: #2980b9;
}

.card-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: 600;
}

.card-content p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
  font-size: 1.2em;
}

@media screen and (max-width: 768px) {
  .home-container {
    padding: 20px 10px;
  }

  h1 {
    font-size: 2em;
  }

  .subtitle {
    font-size: 1.1em;
    margin-bottom: 30px;
  }

  .module-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 10px;
  }

  .module-card {
    padding: 30px;
  }

  .icon-wrapper i {
    font-size: 2.5em;
  }

  .card-content h2 {
    font-size: 1.5em;
    margin-bottom: 15px;
  }

  .card-content p {
    font-size: 1.1em;
  }
}
</style>