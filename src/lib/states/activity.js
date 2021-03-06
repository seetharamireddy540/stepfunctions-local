const store = require('../../store');

class Activity {
  static getTaskParameter(param, activityArn, taskToken) {
    const { activities } = store.getState();
    const task = activities.find(a => a.activityArn === activityArn).tasks
      .find(t => t.taskToken === taskToken);
    return task ? task[param] : undefined;
  }

  static getTaskOutput(activityArn, taskToken) {
    return Activity.getTaskParameter('output', activityArn, taskToken);
  }

  static getTaskStatus(activityArn, taskToken) {
    return Activity.getTaskParameter('status', activityArn, taskToken);
  }

  static getTaskFailureError(activityArn, taskToken) {
    return {
      cause: Activity.getTaskParameter('cause', activityArn, taskToken),
      error: Activity.getTaskParameter('error', activityArn, taskToken),
    };
  }

  static getTaskLastHeartbeat(activityArn, taskToken) {
    return parseFloat(Activity.getTaskParameter('heartbeat', activityArn, taskToken));
  }

  static getTaskWorkerName(activityArn, taskToken) {
    return Activity.getTaskParameter('workerName', activityArn, taskToken);
  }

  static getTask(activityArn, taskToken) {
    const { activities } = store.getState();
    return activities.find(a => a.activityArn === activityArn).tasks
      .find(t => t.taskToken === taskToken);
  }
}

module.exports = Activity;
