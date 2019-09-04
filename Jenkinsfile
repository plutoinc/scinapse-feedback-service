pipeline {
    agent any

    tools {nodejs "Node810"}

    environment {
        SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL = credentials('SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL')
        GOOGLE_SHEET_CLIENT_EMAIL= credentials("GOOGLE_SHEET_CLIENT_EMAIL")
        GOOGLE_SHEET_PRIVATE_KEY= credentials("GOOGLE_SHEET_PRIVATE_KEY")
        FRESHDESK_PRIVATE_API_KEY= credentials("FRESHDESK_PRIVATE_API_KEY")
        FRESHDESK_SCINAPSE_WEBHOOK_URL= credentials("FRESHDESK_SCINAPSE_WEBHOOK_URL")
    }

    stages {
        stage('Checkout') {
            steps {
                slackSend color: 'good', channel: "#ci-build", message: "scinapse-feedback-service Build Started: ${env.BRANCH_NAME}"
                checkout scm
                sh 'git status'
            }
        }

        stage('clean artifacts'){
            steps {
                script {
                    sh 'rm -rf output'
                    sh 'rm -rf node_modules'
                    sh 'npm cache clean -f'
                }
            }
        }

        stage('Install dependencies'){
            steps {
                script {
                    try {
                        sh 'npm --version'
                        sh 'npm ci'
                    } catch (err) {
                        slackSend color: "danger", channel: "#ci-build", failOnError: true, message: "Build Failed at NPM INSTAL: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    try {
                        sh 'npm run deploy'
                        slackSend color: 'good', channel: "#ci-build", message: "scinapse-feedback-service Deploy DONE!"
                    } catch (err) {
                        slackSend color: "danger", failOnError: true, message: "Build Failed at BUILD & DEPLOY: ${env.BRANCH_NAME}"
                        throw err
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}