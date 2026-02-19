#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter '
if [ "$GIT_COMMITTER_EMAIL" = "admin@buybusinessclass.com" ]
then
    export GIT_COMMITTER_NAME="Vladimir Nasalciuc"
    export GIT_COMMITTER_EMAIL="vladimir.nasalciuc@ee.utm.md"
fi
if [ "$GIT_AUTHOR_EMAIL" = "admin@buybusinessclass.com" ]
then
    export GIT_AUTHOR_NAME="Vladimir Nasalciuc"
    export GIT_AUTHOR_EMAIL="vladimir.nasalciuc@ee.utm.md"
fi
export GIT_AUTHOR_NAME="Vladimir Nasalciuc"
export GIT_AUTHOR_EMAIL="vladimir.nasalciuc@ee.utm.md"
export GIT_COMMITTER_NAME="Vladimir Nasalciuc"
export GIT_COMMITTER_EMAIL="vladimir.nasalciuc@ee.utm.md"
' -- --all
