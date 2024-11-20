#!groovy
pipeline {
    // 指定任务在哪个集群节点中执行
    agent any
    tools { nodejs "node-22.11.0" }
    stages {
        stage('构建') {
            steps {
                sh "npm install -g yarn";
                sh "yarn install";
                sh "yarn run build:${env.ENV}";
                sh "sed 's/\r//' -i ./init_bash.sh";
                sh "chmod 777 ./init_bash.sh";
                sh "bash ./init_bash.sh";
            }
        }
    }

    post {
        always {
            echo 'Always'
        }
        success {
            echo "Success"
        }
        failure {
            echo 'Failure'
        }
    }
}
