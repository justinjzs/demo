const http = require('http');
const formidable = require('formidable');
const server = http.createServer( (req, res) => {
  switch (req.method) {
    case 'GET':
      show(req, res);
      break;
    case 'POST':
      upload(req, res);
      break;
  }
});
server.listen(2016);

function show(req, res) {
  let html = ''
   +`<form method="post" action="/" enctype="multipart/form-data">
      <p><input type="text" name="name" /></p>
      <p><input type="file" name="file" /></p>
      <p><input type="submit" value="Upload" /></p>
    </form>`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }
  let form = new formidable.IncomingForm();
  // form.on('field', function (field, value) {
  //   console.log(field);
  //   console.log(value);
  // });
  // form.on('file', function (name, file) {
  //   console.log(name);
  //   console.log(file);
  // });
  // form.on('end', function () {
  //   res.end('upload complete!');
  // });
  form.on('progress', (bytesReceived, bytesExpected) => {
    let percent = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(percent);
  });
  form.parse(req, (err, fields, files) => {
    console.log(fields);
    console.log(files);
    res.end('Update complete!');
  });
}
function isFormData(req) {  //判断上传的类型。
  let type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}
