// API
  postQuestion({ id, name, question, choice, answer, difficulty, type }) {
    return http.post(`/student/${id}/question`, {
      name,
      question,
      choice,
      answer,
      difficulty,
      type,
    });
  },
  getQuestion({ id }) {
    return http.get(`/student/${id}/question`);
  },
  deleteQuestion({ id, qId }) {
    return http.delete(`/student/${id}/question/${qId}`);
  },
  postKeyword({ id, qId, data }) {
    return http.post(`/student/${id}/question/${qId}/keywords`, {
      data,
    });
  },
  getKeyword({ id }) {
    return http.get(`/lectures/${id}/keywords`);
  },
  putQuestion({ id, qId, name, question, score, difficulty, choice, answer, isCheck }) {
    return http.put(`/student/${id}/question/${qId}`, {
      name,
      question,
      score,
      difficulty,
      choice,
      answer,
      isCheck,
    });
  },
  deleteKeyword({ id, qId }) {
    return http.delete(`/student/${id}/question/${qId}/keywords`);
  },
  postFile({ id, qId, file }) {
    return http.post(`/student/${id}/question/${qId}/file`, {
      file,
    });
  },
};
