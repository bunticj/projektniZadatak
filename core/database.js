const mysql = require('mysql');
const bcrypt = require('bcryptjs');

module.exports = class DB {
  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dbforum'
    });
  }

  //CRUD query operations:

  //CREATE  user query operation and hash password in DB
  addUser(data) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });

    bcrypt.hash(data.password, 10, (err, hash) => {

      let sqlQuery = `INSERT INTO user (first_name, last_name, email, password) VALUES (?,?,?,?) `;
      let params = [data.first_name, data.last_name, data.email, hash, data.confirmPassword, data.termsOfService];
      this.connection.query(sqlQuery, params, (err, result) => {
        if (err) throw error;
        prResolve(result);
      });

    });

    return pr;
  }  

  //Create topic
  addTopic(data,uid) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `INSERT INTO topic (title,content,user_id) VALUES (?,?,?) `;
    let params = [data.title, data.content, uid];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

    //Create comment on specific topic
  addComment(data, param,user_id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `INSERT INTO comment (topic_id,user_id,comment_content) VALUES (?,?,?) `;
    let params = [param, user_id, data.comment_content];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }

  // READ  operations
  //Get list of topic titles
  getTopicList() {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT *  FROM topic ORDER BY topic_created_at desc `;
    this.connection.query(sqlQuery, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }
 //Topics with pagination
 getTopicsByPage(limit,offset){

  let prResolve;
  let pr = new Promise((resolve,reject) => {
    prResolve = resolve;
  });
  let sqlQuery = 
  ` SELECT  t.topic_id, u.first_name as top_cr_name, u.last_name AS top_cr_lastname , t.title ,t.content,t.topic_created_at ,c.comment_content ,c.com_created_at,c.user_id as c_creator_id,user.first_name as com_cr_name, user.last_name as com_cr_lastname, c.com_created_at ,c.comment_id
  FROM topic as t 
  LEFT JOIN comment as c ON t.topic_id = c.topic_id  
  LEFT JOIN user as u ON t.user_id = u.id 
  LEFT JOIN user ON c.user_id = user.id
  ORDER BY t.topic_created_at DESC
  LIMIT ${limit} OFFSET ${offset}`;
  let queryParams = [limit,offset]
  this.connection.query(sqlQuery, queryParams, (error, result) => {
    if (error) throw error;
    prResolve(result);
  });
  return pr;
}
searchByTopicTitle(searchQuery){
  let prResolve;
  let pr = new Promise((resolve,reject) => {
    prResolve = resolve;
  });
  let sqlQuery = `SELECT t.topic_id, u.first_name as top_cr_name, u.last_name AS top_cr_lastname , t.title  ,c.comment_content ,
  c.com_created_at,c.user_id as c_creator_id,user.first_name as com_cr_name, user.last_name as com_cr_lastname, c.com_created_at ,c.comment_id
   FROM topic as t 
   LEFT JOIN comment as c ON t.topic_id = c.topic_id 
  LEFT JOIN user as u ON t.user_id = u.id
   LEFT JOIN user ON c.user_id = user.id WHERE t.title LIKE '%${searchQuery}%' ORDER BY t.topic_created_at DESC LIMIT 5`;
  this.connection.query(sqlQuery,searchQuery, (error, result) => {
    if (error) throw error;
    prResolve(result);
  });
  return pr;
}
searchByCommentText(searchQuery){
  let prResolve;
  let pr = new Promise((resolve,reject) => {
    prResolve = resolve;
  });
  let sqlQuery = `SELECT t.topic_id, u.first_name as top_cr_name, u.last_name AS top_cr_lastname , t.title ,t.content,t.topic_created_at ,c.comment_content ,
  c.com_created_at,c.user_id as c_creator_id,user.first_name as com_cr_name, user.last_name as com_cr_lastname ,c.comment_id
   FROM topic as t 
   LEFT JOIN comment as c ON t.topic_id = c.topic_id 
  LEFT JOIN user as u ON t.user_id = u.id
   LEFT JOIN user ON c.user_id = user.id WHERE c.comment_content LIKE '%${searchQuery}%' ORDER BY c.com_created_at DESC LIMIT 5`;
  this.connection.query(sqlQuery,searchQuery, (error, result) => {
    if (error) throw error;
    prResolve(result);
  });
  return pr;



}
getNumOfRows(){
  let prResolve;
  let pr = new Promise((resolve,reject) => {
    prResolve = resolve;
  });
  let sqlQuery = `SELECT COUNT(*) as row_num FROM topic as t 
  LEFT JOIN comment as c ON t.topic_id = c.topic_id  
  LEFT JOIN user as u ON t.user_id = u.id 
  LEFT JOIN user ON c.user_id = user.id`
  this.connection.query(sqlQuery, (error, result) => {
    if (error) throw error;
    prResolve(result);
  });
  return pr;
}

  //Get topic by id
  getSingleTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    /* let sqlQuery = `SELECT t.title,t.content,u.first_name ,u.last_name,c.comment_content FROM topic as t 
     INNER JOIN comment as c ON t.topic_id = c.topic_id INNER JOIN user as u ON t.user_id = u.id WHERE t.topic_id = ?`;*/
    let sqlQuery = `SELECT * FROM topic WHERE  topic_id = ?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }
  //Get all users
  getUsers() {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM user LIMIT 20`;
    this.connection.query(sqlQuery, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }
  //Get user by id
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
  //Get comments on specific topic
  getCommentsOnTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM comment INNER JOIN topic ON topic.topic_id = comment.topic_id WHERE comment.topic_id = ? LIMIT 30`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  getSingleComment(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT * FROM comment WHERE comment.comment_id = ? `;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;

  }

  //UPDATE operations
  //Update user 
  updateUser(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE user SET first_name = COALESCE(?,first_name), last_name = COALESCE(?,last_name)
    WHERE id = ?`
    
    let params = [data.first_name,data.last_name, id];
    this.connection.query(sqlQuery,params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });

    return pr;
  }
  //Reset password
  resetPassword(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    bcrypt.hash(data.password, 10, (err, hash) => {

    let sqlQuery = `UPDATE user SET password = ?  WHERE id = ?`
    
    let params = [hash,id];
    this.connection.query(sqlQuery,params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
  });
    return pr;
  }
  //Update topic
  updateTopic(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE topic SET title = COALESCE(?,title), content = COALESCE(?,content)
  WHERE topic_id = ?`;
    let params = [data.title, data.content, id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

  //Update comment
  updateComment(data, id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `UPDATE comment SET comment_content = COALESCE(?,comment_content)
     WHERE comment_id = ?`;
    let params = [data.comment_content, id];
    this.connection.query(sqlQuery, params, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

//DELETE OPERATIONS 

  //Delete user
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

  //Delete topic
  removeTopic(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `DELETE  FROM topic WHERE topic_id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }
  
  //Delete comment
  removeComment(id) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `DELETE  FROM comment WHERE comment_id =?`;
    this.connection.query(sqlQuery, id, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

 

  //For validation purposes
  getUserByEmail(data) {
    let prResolve;
    let pr = new Promise((resolve, reject) => {
      prResolve = resolve;
    });
    let sqlQuery = `SELECT *  FROM user WHERE email =?`;
    this.connection.query(sqlQuery, data, (error, result) => {
      if (error) throw error;
      prResolve(result);
    });
    return pr;
  }

 

  

}
