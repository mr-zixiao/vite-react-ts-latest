#!/bin/sh
PROJECT_PATH=/usr/local/project/vite-app
if [ -d $PROJECT_PATH ];then
     echo '开始备份vite-app'
     mkdir -p $PROJECT_PATH-old
     rm -rf $PROJECT_PATH-old/*
     cp -r $PROJECT_PATH/*  $PROJECT_PATH-old
     echo '备份vite-app'
  else
    mkdir -p $PROJECT_PATH-old
    mkdir -p $PROJECT_PATH
fi
#清除原始文件
rm -rf $PROJECT_PATH/*
mv ./dist/* $PROJECT_PATH
#复制模型文件,将旧的模型文件移动过来。如果模型文件发生更新，需要手动替换。
if [ -d $PROJECT_PATH-old ];then
  if [ -d $PROJECT_PATH-old/model ];then
    cp -r $PROJECT_PATH-old/model/* ${PROJECT_PATH}/model
   elif [ -d $PROJECT_PATH-old/modeFile ];then
   	 cp -r $PROJECT_PATH-old/modeFile/* ${PROJECT_PATH}/modeFile
  fi
fi
