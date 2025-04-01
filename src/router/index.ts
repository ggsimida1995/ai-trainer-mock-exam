import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import PracticeHome from '../components/practice/PracticeHome.vue'
import ExamHome from '../components/exam/ExamHome.vue'
import Exam from '../components/exam/Exam.vue'
import ExamResult from '../components/exam/ExamResult.vue'
import JudgePractice from '../components/practice/JudgePractice.vue'
import SinglePractice from '../components/practice/SinglePractice.vue'
import MultiPractice from '../components/practice/MultiPractice.vue'
import WrongQuestions from '@/components/exam/WrongQuestions.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.PROD ? '/ai-trainer-mock-exam/' : '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/practice',
      name: 'practice',
      component: PracticeHome
    },
    {
      path: '/exam',
      name: 'examHome',
      component: ExamHome
    },
    {
      path: '/exam/test',
      name: 'exam',
      component: Exam
    },
    {
      path: '/exam/result',
      name: 'examResult',
      component: ExamResult
    },
    {
      path: '/judge',
      name: 'judge',
      component: JudgePractice
    },
    {
      path: '/single',
      name: 'single',
      component: SinglePractice
    },
    {
      path: '/multi',
      name: 'multi',
      component: MultiPractice
    },
    {
      path: '/wrong-questions',
      name: 'WrongQuestions',
      component: WrongQuestions
    }
  ]
})

export default router