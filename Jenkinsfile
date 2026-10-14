pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    test -f index.html
                    test -f Dockerfile
                    grep -q "My First CI/CD Pipeline" index.html
                    echo "Tests passed"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t basic-cicd:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker rm -f basic-cicd-app || true

                    docker run -d \
                      --name basic-cicd-app \
                      --restart unless-stopped \
                      -p 8081:80 \
                      basic-cicd:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    for i in $(seq 1 10); do
                        if curl -fsS http://localhost:8081/ \
                          | grep -q "My First CI/CD Pipeline"; then
                            echo "Deployment successful"
                            exit 0
                        fi
                        sleep 2
                    done

                    docker logs basic-cicd-app || true
                    exit 1
                '''
            }
        }
    }
}
