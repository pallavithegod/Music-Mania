pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        AWS_ACCOUNT_ID = '001740294602'
        ECR_REPO = 'music-mania'
        PROD_HOST = 'YOUR_INSTANCE_2_PRIVATE_IP'
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
        ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $ECR_REPO:$IMAGE_TAG .
                    docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI:$IMAGE_TAG
                    docker tag $ECR_REPO:$IMAGE_TAG $ECR_URI:latest
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    docker push $ECR_URI:$IMAGE_TAG
                    docker push $ECR_URI:latest
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(credentials: ['music-mania-prod-ssh']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@$PROD_HOST "bash /opt/music-mania/deploy.sh $IMAGE_TAG"
                    '''
                }
            }
        }
    }
}