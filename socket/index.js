/*
 * @Author: dana_chen
 * @Date:   2019-08-09 10:31:00
 * @Last Modified by:   dana_chen@sina.cn
 * @Last Modified time: 2019-08-12 15:35:18
 */
const IO = require('socket.io'),
  {
    getFulldate
  } = require('../util');

function creatSocket(app) {
  const io = IO(app);
  //每个客户端socket连接时都会触发 connection 事件
  io.on("connection", function(clientSocket) {
    clientSocket.emit("receiveMsg", '连接整体的socket');
    console.log('连接整体的socket');
  });
  //单独的命名空间
  //命名空间：监听属性改变的，deviceInfo
  const deviceIo = io.of('/deviceInfo');
  let deviceId = '';
  deviceIo.on("connection", function(clientSocket) {
    //console.log('clientSocket.handshake.query.id:', clientSocket.handshake.query.id)
    deviceId = clientSocket.handshake.query.id;
    clientSocket.emit("receiveMsg", '连接deviceInfo的socket');
    console.log('连接deviceInfo的socket');
    clientSocket.join(deviceId); //加入房间
    //deviceInfo下的room
    setInterval(function() {
      let time = getFulldate();
      clientSocket.to(deviceId).emit(`deviceParam`, `deviceParam ${deviceId} time:` + time);
    }, 5000)
  });

  const adminIo = io.of('/admin');
  adminIo.on("connection", function(clientSocket) {
    clientSocket.emit("receiveMsg", '连接adminIo的socket');
    console.log('连接adminIo的socket');
  });

}

module.exports = creatSocket
