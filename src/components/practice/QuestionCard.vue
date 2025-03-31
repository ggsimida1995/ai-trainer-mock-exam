<template>
  <div class="question-card">
    <div class="question-content">
      <h3>{{ question.question }}</h3>
      
      <div class="options">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="option"
          :class="{
            'selected': isSelected(option),
            'correct': isSelected(option) && isCorrect(option),
            'wrong': isSelected(option) && !isCorrect(option)
          }"
          @click="selectOption(option)"
        >
          {{ option }}
        </div>
      </div>

      <div v-if="isAnswered" class="explanation">
        <div class="correct-answer">
          <div class="correct-answer-header">
            <span>正确答案</span>
          </div>
          <div class="correct-answer-content">
            {{ Array.isArray(question.answer) ? question.answer.join('、') : question.answer }}
          </div>
        </div>
        <div class="explanation-header">
          <span>答案解析</span>
        </div>
        <div class="explanation-content">
          {{ question.explanation || '无' }}
        </div>
      </div>
    </div>

    <div class="actions">
      <button
        :disabled="!isAnswered"
        @click="$emit('next')"
      >
        下一题
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '../../types/question'

const props = defineProps<{
  question: Question
  showResult?: boolean
}>()

const emit = defineEmits<{
  (e: 'answer', answer: string | string[]): void
  (e: 'next'): void
  (e: 'show-result', show: boolean): void
}>()

const isAnswered = computed(() => {
  if (Array.isArray(props.question.userAnswer)) {
    return props.question.userAnswer.length > 0
  }
  return props.question.userAnswer !== ''
})

const isSelected = (option: string) => {
  if (Array.isArray(props.question.userAnswer)) {
    return props.question.userAnswer.includes(option)
  }
  return props.question.userAnswer === option
}

const isCorrect = (option: string) => {
  if (Array.isArray(props.question.answer)) {
    return props.question.answer.includes(option)
  }
  return props.question.answer === option
}

const selectOption = (option: string) => {
  // 设置答案
  if (Array.isArray(props.question.userAnswer)) {
    const newAnswer = [...props.question.userAnswer]
    const index = newAnswer.indexOf(option)
    if (index === -1) {
      newAnswer.push(option)
    } else {
      newAnswer.splice(index, 1)
    }
    emit('answer', newAnswer)
  } else {
    // 对于单选题和判断题，直接设置答案
    emit('answer', option)
  }
}
</script>

<style scoped>
.question-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.question-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 20px;
  max-height: calc(100vh - 300px);
}

h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  position: relative;
}

.option:hover {
  background: #f5f5f5;
}

.option.selected {
  background: #e3f2fd;
  border-color: #2196f3;
}

.option.correct {
  background: #e8f5e9 !important;
  border-color: #4caf50 !important;
}

.option.wrong {
  background: #ffebee !important;
  border-color: #f44336 !important;
}

.option.correct::after {
  content: '✓';
  position: absolute;
  right: 12px;
  color: #4caf50;
  font-weight: bold;
}

.option.wrong::after {
  content: '✕';
  position: absolute;
  right: 12px;
  color: #f44336;
  font-weight: bold;
}

.explanation {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.correct-answer {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.correct-answer-header,
.explanation-header {
  margin-bottom: 10px;
}

.correct-answer-header span,
.explanation-header span {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.correct-answer-content {
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
  color: #2e7d32;
  font-size: 15px;
  line-height: 1.6;
}

.explanation-content {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
  font-size: 15px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #2196f3;
  color: white;
  transition: background-color 0.3s ease;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #1976d2;
}

@media screen and (max-width: 768px) {
  .question-card {
    padding: 15px;
  }

  h3 {
    font-size: 16px;
  }

  .option {
    padding: 10px;
    font-size: 15px;
  }

  .explanation-content {
    font-size: 14px;
    padding: 8px;
  }

  .actions {
    flex-direction: column;
  }

  button {
    width: 100%;
    padding: 12px;
  }
}
</style>