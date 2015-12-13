#!/bin/sh


# Create the gh-pages branch first
#   git checkout --orphan gh-pages
#   git commit -a -m "first commit"
#	git push origin gh-pages

git branch -D gh-pages
git push origin :gh-pages

git checkout --orphan gh-pages
git add .
git commit -a -m "Update gh-pages branch"
git push origin gh-pages

git checkout master
