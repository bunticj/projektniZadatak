const mysql = require('mysql');

module.exports = class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'forumdb'
    });
  }

  //CRUD :

  //CREATE  operations
  addUser(data) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `INSERT INTO user (first_name, last_name, email, password) VALUES (?,?,?,?) `;
    let params = [data.first_name, data.last_name, data.email, data.password, data.confirmPassword, data.termsOfService];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  addTopic(data) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `INSERT INTO topic (title,content,user_id) VALUES (?,?,?) `;
    let params = [data.title, data.content, data.user_id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  addComment(data,param) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `INSERT INTO comment (topic_id,user_id,comment_content) VALUES (?,?,?) `;
    let params = [param.id, data.user_id, data.comment_content];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  // READ  operations
  getTopicList() {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT title FROM topic `;
    this.connection.query(sqlQuery, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

  getSingleTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    //Mislio sam izlistati i komentare i usera ,ali ukoliko neka tema nema komentara,nece mi je izlistati uopce  kada je trazim po ID-u
    /* let sqlQuery = `SELECT t.title,t.content,u.first_name ,u.last_name,c.comment_content FROM topic as t 
     INNER JOIN comment as c ON t.topic_id = c.topic_id INNER JOIN user as u ON t.user_id = u.id WHERE t.topic_id = ?`;*/
    let sqlQuery = `SELECT * FROM topic WHERE  topic_id = ?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  getUsers() {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM user`;
    this.connection.query(sqlQuery, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  getSingleUser(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM user WHERE id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  getCommentsOnTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM comment INNER JOIN topic ON topic.topic_id = comment.topic_id WHERE comment.topic_id = ?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  //UPDATE operations
  updateUser(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE user SET first_name = COALESCE(?,first_name), last_name = COALESCE(?,last_name), email = COALESCE(?,email),
    password = COALESCE(?,password) WHERE id = ?`;
    let params = [data.first_name, data.last_name, data.email, data.password, id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  updateTopic(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE topic SET title = COALESCE(?,title), content = COALESCE(?,content), user_id = COALESCE(?,user_id)
     WHERE topic_id = ?`;
    let params = [data.title, data.content, data.user_id, id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  updateComment(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE comment SET topic_id = COALESCE(?,topic_id), user_id = COALESCE(?,user_id), comment_content = COALESCE(?,comment_content)
     WHERE comment_id = ?`;
    let params = [data.topic_id, data.user_id, data.comment_content, id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  //DELETE operations

  removeUser(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `DELETE  FROM user WHERE id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  removeTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `DELETE  FROM topic WHERE id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  removeComment(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `DELETE  FROM comment WHERE id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

//for validation purposes
  getEmails(data) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT email  FROM user WHERE email =?`;
    this.connection.query(sqlQuery, data, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

 

}