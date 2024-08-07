REPOSITORY=harbor.cloud2go.cn/pageplug/pageplug-ee
DATE_NOW=$(date +%Y%m%d%H%M)
VERSION="${REPOSITORY}:$1_${DATE_NOW}"

docker build --platform linux/amd64 -t ${VERSION} .
docker push ${VERSION}