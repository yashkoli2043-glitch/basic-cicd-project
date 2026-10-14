
pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                bat '''
                    if not exist index.html exit /b 1
                    if not exist style.css exit /b 1
                    if not exist script.js exit /b 1
                    if not exist Dockerfile exit /b 1
                    findstr /I /C:"ShopEase" index.html >NUL
                    if errorlevel 1 exit /b 1
                    echo All ShopEase application checks passed!
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t basic-cicd:%BUILD_NUMBER% .'
            }
        }

        stage('Deploy Application') {
            steps {
                bat '''
                    docker rm -f basic-cicd-app 2>NUL
                    docker run -d --name basic-cicd-app --restart unless-stopped -p 8081:80 basic-cicd:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                    curl.exe -fsS http://localhost:8081/ -o response.html
                    if errorlevel 1 exit /b 1

                    findstr /I /C:"ShopEase" response.html >NUL
                    if errorlevel 1 exit /b 1

                    echo SUCCESS: ShopEase website is responding correctly.
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD pipeline failed. Check Console Output.'
        }
    }
}
