// 문제출제
<template>
  <div style="width: 600px;">
    <el-form :model="quizForm" label-width="100px">
      <el-form-item label="문항 유형">
        <el-radio-group v-model="questionType" @change="initialForm">
          <el-radio-button label="1">단답</el-radio-button>
          <el-radio-button label="0">객관</el-radio-button>
          <el-radio-button label="2">서술</el-radio-button>
          <el-radio-button label="4">SQL</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-show="questionType === null">
        <el-alert
          title="문항 유형을 선택해주세요"
          :closable="false"
          type="warning"
          show-icon center>
        </el-alert>
      </div>
      <div v-if="questionType !== null">
        <el-form-item label="제목">
          <el-input v-model="questionName" placeholder="제목을 입력하세요"
          type="textarea" :autosize="{minRows: 2, maxRows: 3 }"></el-input>
        </el-form-item>
        <el-form-item label="문제">
          <el-input v-model="question" placeholder="내용을 입력하세요." 
          type="textarea" :autosize="{ minRows: 8, maxRows: 12 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            :auto-upload="false"
            :on-change="handleChange"
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="initFileList">
            <el-button slot="trigger" type="primary">파일 추가</el-button>
            <span slot="tip" class="el-upload__tip">
              사진(jpg, png, gif) 및 동영상(mp4) 파일만 가능합니다.</span>
          </el-upload>
        </el-form-item>

        <template v-if="questionType === '1'">
          <el-form-item label="답">
            <el-input v-for="(item, index) in answer" :key="index" 
            v-model="answer[index]" placeholder="내용을 입력하세요." type="textarea"></el-input>
            <p>
            <el-button type="primary" @click="onClick('ADD_ANSWER')">추가</el-button>
            <el-button v-if="answer.length > 1" type="danger" @click="onClick('DELETE_ANSWER')">제거</el-button>
            </p>
          </el-form-item>
        </template>
        <template v-if="questionType === '0'">
          <el-form-item label="보기">
            <el-checkbox-group v-model="answer">
              <el-checkbox label="1">1.</el-checkbox>
              <div style="display: inline-block; width: 90%; margin-left: 10px;">
                <el-input v-model="questionList[0]" placeholder="내용을 입력하세요."></el-input>
              </div>
              <el-checkbox label="2">2.</el-checkbox>
              <div style="display: inline-block; width: 90%; margin-left: 10px;">
                <el-input v-model="questionList[1]" placeholder="내용을 입력하세요."></el-input>
              </div>
              <el-checkbox label="3">3.</el-checkbox>
              <div style="display: inline-block; width: 90%; margin-left: 10px;">
                <el-input v-model="questionList[2]" placeholder="내용을 입력하세요."></el-input>
              </div>
              <el-checkbox label="4">4.</el-checkbox>
              <div style="display: inline-block; width: 90%; margin-left: 10px;">
                <el-input v-model="questionList[3]" placeholder="내용을 입력하세요."></el-input>
              </div>
              <el-checkbox label="5">5.</el-checkbox>
              <div style="display: inline-block; width: 90%; margin-left: 10px;">
                <el-input v-model="questionList[4]" placeholder="내용을 입력하세요."></el-input>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <template v-if="questionType === '2'">
          <el-form-item label="모범답안">
            <el-input v-model="answer[0]" placeholder="내용을 입력하세요." type="textarea"
            :autosize="{ minRows: 8, maxRows: 12}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
              :auto-upload="false"
              :file-list="initFileList"
              :limit="3"
              :on-exceed="handleExceed">
              <el-button slot="trigger" type="primary">파일 추가</el-button>
            </el-upload>
          </el-form-item>
        </template>
        <template v-if="questionType === '4'">
          <el-form-item label="SQLite">
            <el-upload
              :auto-upload="false"
              :file-list="initFileList"
              :limit="1"
              :on-exceed="handleExceed">
              <el-button slot="trigger">파일 추가</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="답">
            <el-input v-model="answer[0]" placeholder="내용을 입력하세요." type="textarea"></el-input>
          </el-form-item>
        </template>

        <el-form-item label="난이도">
          <el-select v-model="level">
            <el-option v-for="diff in diffList" :key="diff" :value="diff">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="키워드">
          <div style="width: 50%; margin-bottom: 5px;">
            <el-select v-model="keywordName" placeholder="키워드">
              <el-option v-for="key in keyList" :key="key.keyword" :value="key.keyword">
              </el-option>
            </el-select>
          </div>
          <el-select v-model="keywordPoint" placeholder="배점">
            <el-option v-for="pt in pts" :key="pt" :value="pt">
            </el-option>
          </el-select>
          <el-button @click="onClick('ADD_KEYWORD')">추가</el-button>
          <div v-for="(item, index) in keywordList" :key="item.keyword">
            <el-button>{{ item.keyword }} :: {{item.score_portion }}점</el-button>
            <el-button @click="onClick('DELETE_KEYWORD', index)" type="danger"
            style="margin-bottom: 5px;">X</el-button>
          </div>
        </el-form-item>
        <div class="ps-align-right">
          <el-button type="primary" @click="onCreate">출제하기</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import studentService from '../../services/studentService';

export default {
  data() {
    return {
      questionName: [],
      question: [],
      questionType: null,
      initFileList: [],
      questionList: [],
      answer: [''],
      level: 3,
      diffList: [5, 4, 3, 2, 1],
      keywordName: '',
      keywordPoint: '',
      pts: [5, 4, 3, 2, 1],
      keywordList: [],
      keyList: [],
    };
  },
  async mounted() {
    const vm = this;
    const lid = vm.$route.params.lectureId;
    const res = await studentService.getKeyword({ id: lid });
    for (let i = 0; i < res.data.length; i += 1) {
      vm.keyList.push(res.data[i]);
    }
  },
  methods: {
    initialForm() {
      const vm = this;
      vm.level = 3;
      vm.questionName = [];
      vm.question = [];
      vm.questionList = [];
      vm.answer = [''];
      vm.initFileList = [];
      vm.keywordName = '';
      vm.keywordPoint = '';
      vm.keywordList = [];
    },
    handleChange(file, filelist) {
      const vm = this;
      if (!(['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].includes(file.raw.type))) {
        vm.$message.warning('업로드 가능한 파일 형식이 아닙니다.');
        vm.initFileList = filelist.slice(0, -1);
      }
    },
    handleExceed() {
      const vm = this;
      vm.$message.warning('업로드 가능한 파일 개수를 초과하였습니다.');
    },
    onClick(type, arg) {
      const vm = this;
      switch (type) {
        case 'ADD_ANSWER': {
          vm.answer.push('');
          break;
        }
        case 'DELETE_ANSWER': {
          vm.answer.pop();
          break;
        }
        case 'ADD_KEYWORD': {
          if (vm.keywordName !== '' && vm.keywordPoint !== '') {
            for (let i = 0; i < vm.keywordList.length; i += 1) {
              if (vm.keywordList[i].keyword === vm.keywordName) {
                vm.$notify({
                  title: '알림',
                  message: '이미 등록한 키워드는 등록할 수 없습니다.',
                  type: 'warning',
                });
                vm.keywordName = '';
                vm.keywordPoint = '';
              }
            }
            if (vm.keywordName !== '') {
              vm.keywordList.push({
                keyword: vm.keywordName,
                score_portion: vm.keywordPoint,
              });
              vm.keywordName = '';
              vm.keywordPoint = '';
            }
            break;
          } else {
            vm.$message.warning('키워드와 배점을 모두 입력하십시오.');
            break;
          }
        }
        case 'DELETE_KEYWORD': {
          vm.keywordList.splice(arg, 1);
          break;
        }
        default: {
          break;
        }
      }
    },
    async onCreate() {
      const vm = this;
      const lid = vm.$route.params.lectureId;
      if (!vm.keywordList.length) {
        vm.$message.warning('키워드는 필수 입력입니다.');
      } else {
        const res = await studentService.postQuestion({
          id: lid,
          name: vm.questionName,
          question: vm.question,
          choice: vm.questionList,
          answer: vm.answer,
          difficulty: vm.level,
          type: vm.questionType,
        });
        try {
          await studentService.postKeyword({
            id: lid,
            qId: res.data.student_question_id,
            data: vm.keywordList,
          });
          vm.$message.success('출제 완료');
          setTimeout(() => {
            location.reload();
          }, 2000);
        } catch (error) {
          vm.$notify({
            title: '키워드 추가/수정 실패',
            message: error.toString(),
            type: 'error',
            duration: 3000,
          });
        }
      }
    },
  },
};
</script>
