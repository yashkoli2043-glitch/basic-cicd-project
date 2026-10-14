
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
