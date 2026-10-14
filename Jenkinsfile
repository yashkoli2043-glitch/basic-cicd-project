
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
                bat '''
                    if not exist index.html exit /b 1
                    if not exist Dockerfile exit /b 1

                    findstr /I /C:"Gym" index.html >NUL
                    if errorlevel 1 exit /b 1

                    echo Tests passed
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
                    docker rm -f basic-cicd-app
                    if errorlevel 1 echo No previous container to remove

                    docker run -d --name basic-cicd-app --restart unless-stopped -p 8081:80 basic-cicd:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                    for /L %%i in (1,1,10) do (
                        curl.exe -fsS http://localhost:8081/ | findstr /I /C:"Gym" >NUL
                        if not errorlevel 1 goto :success
                        timeout /t 2 /nobreak >NUL
                    )

                    docker logs basic-cicd-app
                    exit /b 1

                    :success
                    echo Deployment successful
                '''
            }
        }
    }
}
