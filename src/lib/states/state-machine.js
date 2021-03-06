const Choices = require('./choices');
const Fail = require('./fail');
const Parallel = require('./parallel');
const Pass = require('./pass');
const Succeed = require('./succeed');
const Task = require('./task');
const Wait = require('./wait');

class StateMachine {
  constructor(stateMachine, execution, config) {
    this.stateMachine = stateMachine;
    this.execution = execution;
    this.config = config;
  }

  findStateByName(name) {
    return this.stateMachine.States[name];
  }

  static instanciateState(state, execution, name, config) {
    switch (state.Type) {
      case 'Choice': return new Choices(state, execution, name);
      case 'Fail': return new Fail(state, execution, name);
      case 'Parallel': return new Parallel(state, execution, name, config);
      case 'Pass': return new Pass(state, execution, name);
      case 'Succeed': return new Succeed(state, execution, name);
      case 'Task': return new Task(state, execution, name, config);
      case 'Wait': return new Wait(state, execution, name);
      default: throw new Error(`Invalid state type: ${state.Type}`);
    }
  }

  async execute(input) {
    this.input = input;
    let lastIO = input;
    let nextStateName = this.stateMachine.StartAt;
    do {
      try {
        const currentStateName = nextStateName;
        const nextState = StateMachine.instanciateState(
          this.findStateByName(currentStateName),
          this.execution,
          currentStateName,
          this.config,
        );
        const res = await nextState.execute(lastIO);
        lastIO = res.output;
        nextStateName = res.nextState || null;
      } catch (e) {
        throw e;
      }
    } while (typeof nextStateName === 'string');

    return {
      output: lastIO,
    };
  }
}

module.exports = StateMachine;
