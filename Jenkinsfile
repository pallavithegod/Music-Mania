pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REPO = 'music-mania'
        IMAGE_TAG = "${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Validate Config') {
            steps {
                sh '''
                    test -n "$AWS_ACCOUNT_ID" || (echo "AWS_ACCOUNT_ID missing in Jenkins env" && exit 1)
                    test -n "$PROD_HOST" || (echo "PROD_HOST missing in Jenkins env" && exit 1)

                    echo "$AWS_ACCOUNT_ID" | grep -Eq '^[0-9]{12}$' || (echo "AWS_ACCOUNT_ID must be 12 digits" && exit 1)
                    echo "$AWS_REGION" | grep -Eq '^[a-z]{2}-[a-z]+-[0-9]$' || (echo "AWS_REGION must be like eu-north-1, not eu-north-1a" && exit 1)
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

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
                    ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"

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