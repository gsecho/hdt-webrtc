const fs = require('fs');
// const git = require('git-rev-sync');

// const gitVersion = git.short();
// const gitVersionLong = git.long();
// const gitBranch = git.branch();
// const gitTag = git.tag();
// const gitIsDirty = git.isDirty();
// const gitIsTagDirty = git.isTagDirty();

// let versionInfo = 'Version Info: ';
// if(gitIsTagDirty){
//   // 没有tag存在
//   versionInfo = versionInfo + 'v0.0.0-' + gitVersion;
// }else{
//   // 有tag存在
//   versionInfo = versionInfo + gitTag;
// }

// 输出文件路径
// const outPath = './../customerportalbackend/src/main/resources/static/';
const outPath = './dist/';

// 输出文件
const file = 'version';
const f = outPath + file;
// 输出内容
// const content = gitIsTagDirty ? `v0.0.0-${  gitVersion}` : gitTag;

// 如果存在同名文件，先删除
fs.access(f, (err)=> {
  if(!err){
    // 存在旧文件，先删除
    fs.unlink(f, (e) => {
      if(e){
        console.log('Delete version file write fail. Error message is followed:');
        console.log(e);
        return false;
      }
    })
  }

  // 输出文件
  fs.writeFile(f, content, 'utf8', (err) => {
    if(err){
      console.log('Version file write fail. Error message is followed:');
      console.log(err);
      return false;
    }
  });
});


