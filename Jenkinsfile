pipeline {
    agent any

    tools {
        maven 'Maven 3.9.2'
    }

    environment {
        SELENIUM_REMOTE_URL = "http://selenium-chrome:4444"
        BASE_URL = "http://projecttracker-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Backend & UI Tests') {
            steps {
                dir('JiraBE') {
                    sh '''
                        echo "Running all tests using docker-compose services..."
                        mvn clean verify -Dspring.profiles.active=docker
                    '''
                    junit 'target/surefire-reports/*.xml'
                    junit 'target/failsafe-reports/*.xml'
                }
            }
        }

    stage('Authentication Tests') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=AdminLoginTest,ProfileLogoutTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('Sprint Creation Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=SprintCreationTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('Task Management Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=TaskManagementTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('Kanban Board Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=KanbanBoardTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('Backlog Search Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=BacklogSearchTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('User Management Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=UserManagementTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

           stage('Reporting Test') {
               steps {
                   dir('JiraBE') {
                       sh 'mvn test -Dtest=ReportingTest -DSELENIUM_REMOTE_URL=$SELENIUM_REMOTE_URL -DBASE_URL=$BASE_URL'
                   }
               }
           }

    }

    post {
        always {
            echo "Tests finished. Services are managed by docker-compose, no containers are stopped here."
        }
    }
}
