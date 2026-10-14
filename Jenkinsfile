
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
            echo Checking ShopEase website...
            curl.exe -fsS http://localhost:8081/ -o response.html
            if errorlevel 1 (
                echo ERROR: Website is not responding.
                docker logs basic-cicd-app
                exit /b 1
            )

            findstr /I /C:"ShopEase" response.html >NUL
            if errorlevel 1 (
                echo ERROR: ShopEase content was not found.
                type response.html
                exit /b 1
            )

            echo SUCCESS: ShopEase website is responding correctly.
        '''
    }
}
