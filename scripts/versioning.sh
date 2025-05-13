#!/bin/bash

# Versioning script for GitHub Actions
# Usage: ./versioning.sh "release-level release-type"
# Example: ./versioning.sh "patch release" or ./versioning.sh "minor beta"

# 检查参数
if [[ -z "$1" ]]; then
  echo "Error: No parameters provided."
  echo "Usage: ./versioning.sh \"release-level release-type\""
  echo "Example: ./versioning.sh \"patch release\" or ./versioning.sh \"minor beta\""
  exit 1
fi

# 解析参数
INPUT="$1"
RELEASE_LEVEL=$(echo $INPUT | awk '{print $1}')
RELEASE_TYPE=$(echo $INPUT | awk '{print $2}')

echo "Using release level: $RELEASE_LEVEL"
echo "Using release type: $RELEASE_TYPE"

# 验证release level
if [[ ! "$RELEASE_LEVEL" =~ ^(major|minor|patch)$ ]]; then
  echo "Error: Invalid release level. Must be one of: major, minor, patch"
  exit 1
fi

# 验证release type
if [[ ! "$RELEASE_TYPE" =~ ^(release|prerelease|beta|alpha)$ ]]; then
  echo "Error: Invalid release type. Must be one of: release, prerelease, beta, alpha"
  exit 1
fi

# 根据release type和level确定版本更新命令
if [[ "$RELEASE_TYPE" == "release" ]]; then
  # 对于正式版，直接使用level进行更新
  echo "Updating to new $RELEASE_LEVEL version..."
  pnpm version $RELEASE_LEVEL 
else
  # 对于预发布版本，使用prelevel
  echo "Updating to new pre-$RELEASE_LEVEL version with $RELEASE_TYPE tag..."
  pnpm version pre$RELEASE_LEVEL --preid $RELEASE_TYPE 
fi

# 从package.json中读取更新后的版本号
NEW_VERSION=$(node -p "require('./package.json').version")

# 提取纯版本号（移除"v"前缀，如果有的话）
CLEAN_VERSION=$(echo $NEW_VERSION | sed 's/^v//')
echo "Updated version: $CLEAN_VERSION"

# 将版本号输出到GitHub Actions
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "version=$CLEAN_VERSION" >> $GITHUB_OUTPUT
fi

# 返回新版本号，便于在shell命令中捕获
echo "$CLEAN_VERSION"