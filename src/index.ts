import { Application } from 'probot' // eslint-disable-line no-unused-vars
import { ChecksCreateParams, ReposGetBranchParams, ReposGetContentsParams, ChecksUpdateParams } from '@octokit/rest';

export = (app: Application) => {

  app.log("STARTING GEMMY BUFFET");

  /***
   * Listens for a server branch to open a PR
   */
  app.on('pull_request.opened', async (context) => {

    app.log("PR OPENED");

    const pullRequestBranch = context.payload.pull_request.head.ref;
   
    //Add a check to the PR
    const check: ChecksCreateParams = {
      head_sha: context.payload.pull_request.head.sha,
      name: "Checking Gemfile.lock",
      owner: 'adamb3ard',
      repo: 'dummy_server'
    }

    let check_id: number = 1; //maybe fix up later

    await context.github.checks.create(check).then( data => {
      app.log("CREATED CHECK")
      check_id = data.data.id;
    });

    //Get latest commit SHA from Plutonic
    const plutonicRepo: ReposGetBranchParams = {
      branch: 'master',
      owner: 'adamb3ard',
      repo: 'dummy_plutonic'
    }

    let plutonicSha: any;

    await context.github.repos.getBranch(plutonicRepo).then( plutonic => {
      plutonicSha = plutonic.data.commit.sha;
    })

    //Get Gemfile.lock contents
    const gemLock: ReposGetContentsParams = {
      owner: 'adamb3ard',
      repo: 'dummy_server',
      ref: pullRequestBranch,
      path: 'Gemfile.lock'
    }

    let gemLockContents: any;

    await context.github.repos.getContents(gemLock).then( data => {
      gemLockContents = data.data;
    });

    //Update the PR check with a pass or fail status
    let updateCheck: ChecksUpdateParams = {
      check_run_id: check_id,
      owner: 'adamb3ard',
      repo: 'dummy_server'
    }

    //Check if the gemfile contains the latest hash
    if (Buffer.from(gemLockContents.content,'base64').toString().includes(plutonicSha)) {
      app.log('CONTAINS THE SHA')
      updateCheck.conclusion = "success"
      context.github.checks.update(updateCheck);
    } else {
      app.log("DOES NOT CONTAIN LATEST SHA")
      updateCheck.conclusion = "failure"
      context.github.checks.update(updateCheck);
    }

  })

  /***
   * Listens for a server branch to reopen a PR
   */
  app.on('pull_request.reopened', async (context) => {

    app.log("PR RE-OPENED");

    const pullRequestBranch = context.payload.pull_request.head.ref;
   
    //add a check to the recieved PR
    const check: ChecksCreateParams = {
      head_sha: context.payload.pull_request.head.sha,
      name: "Checking Gemfile.lock",
      owner: 'adamb3ard',
      repo: 'dummy_server'
    }

    let check_id: number = 1; //should probs update in future

    await context.github.checks.create(check).then( data => {
      app.log("CREATED CHECK")
      check_id = data.data.id;
    });

    //Get latest SHA from plutonic
    const plutonicRepo: ReposGetBranchParams = {
      branch: 'master',
      owner: 'adamb3ard',
      repo: 'dummy_plutonic'
    }

    let plutonicSha: any;

    await context.github.repos.getBranch(plutonicRepo).then( plutonic => {
      plutonicSha = plutonic.data.commit.sha;
    })

    //Get Gemfile.lock contents
    const gemLock: ReposGetContentsParams = {
      owner: 'adamb3ard',
      repo: 'dummy_server',
      ref: pullRequestBranch,
      path: 'Gemfile.lock'
    }

    let gemLockContents: any;

    await context.github.repos.getContents(gemLock).then( data => {
      gemLockContents = data.data;
    });

    //Update check to pass or fail
    let updateCheck: ChecksUpdateParams = {
      check_run_id: check_id,
      owner: 'adamb3ard',
      repo: 'dummy_server'
    }

    if (Buffer.from(gemLockContents.content,'base64').toString().includes(plutonicSha)){
      app.log('CONTAINS THE SHA')
      updateCheck.conclusion = "success"
      context.github.checks.update(updateCheck);
    } else {
      app.log("DOES NOT CONTAIN LATEST SHA")
      updateCheck.conclusion = "failure"
      context.github.checks.update(updateCheck);
    }

  })
}
