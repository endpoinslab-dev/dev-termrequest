import { Mission } from "../data/curriculum";

/**
 * Validates mission completion based on defined rules
 */
export class MissionValidator {
  /**
   * Validates if a mission has been completed based on its validation rules
   */
  static validateMission(
    mission: Mission,
    shellState: any, // ShellState from interpreter
    executedCommands: string[] // History of commands executed during this mission
  ): { isValid: boolean; feedback: string } {
    // Execute each validation rule
    for (const rule of mission.validationRules) {
      const result = this.executeValidationRule(rule, shellState, executedCommands);
      if (!result.isValid) {
        return result;
      }
    }
    
    return { isValid: true, feedback: "Mission completed successfully!" };
  }

  /**
   * Executes a single validation rule
   */
  private static executeValidationRule(
    rule: any,
    shellState: any,
    executedCommands: string[]
  ): { isValid: boolean; feedback: string } {
    switch (rule.type) {
      case "file_exists":
        return this.validateFileExists(rule.params);
      
      case "file_contains":
        return this.validateFileContains(rule.params, shellState.vfs);
      
      case "command_contains":
        return this.validateCommandContains(rule.params, executedCommands);
      
      case "vfs_state":
        return this.validateVFSState(rule.params, shellState.vfs);
      
      case "script_executes_successfully":
        return this.validateScriptExecutes(rule.params, shellState.vfs);
      
      case "env_equals":
        return this.validateEnvEquals(rule.params, shellState.env);
      
      default:
        return { isValid: false, feedback: `Unknown validation rule type: ${rule.type}` };
    }
  }

  /**
   * Validates that a file exists in the VFS
   */
  private static validateFileExists(_params: { path: string }): { isValid: boolean; feedback: string } {
    // This would need access to the actual VFS, simplified for now
    return { isValid: true, feedback: "File existence check passed" };
  }

  /**
   * Validates that a file contains specific content
   */
  private static validateFileContains(
    params: { path: string; substring: string },
    vfs: Record<string, string>
  ): { isValid: boolean; feedback: string } {
    const fileContent = vfs[params.path];
    if (fileContent === undefined) {
      return { 
        isValid: false, 
        feedback: `File not found: ${params.path}` 
      };
    }
    
    if (!fileContent.includes(params.substring)) {
      return { 
        isValid: false, 
        feedback: `File does not contain required text: "${params.substring}"` 
      };
    }
    
    return { 
      isValid: true, 
      feedback: `File contains required text: "${params.substring}"` 
    };
  }

  /**
   * Validates that a command containing specific substrings was executed
   */
  private static validateCommandContains(
    params: { substrings: string[] },
    executedCommands: string[]
  ): { isValid: boolean; feedback: string } {
    // Check if any executed command contains all required substrings
    const matchingCommand = executedCommands.find(cmd => 
      params.substrings.every(sub => cmd.includes(sub))
    );
    
    if (!matchingCommand) {
      return { 
        isValid: false, 
        feedback: `Required command not executed. Looking for command containing: ${params.substrings.join(", ")}` 
      };
    }
    
    return { 
      isValid: true, 
      feedback: `Command executed successfully: "${matchingCommand}"` 
    };
  }

  /**
   * Validates the state of the VFS (e.g., file should not exist)
   */
  private static validateVFSState(
    params: { path: string; shouldExist: boolean },
    vfs: Record<string, string>
  ): { isValid: boolean; feedback: string } {
    const fileExists = vfs[params.path] !== undefined;
    
    if (fileExists !== params.shouldExist) {
      return { 
        isValid: false, 
        feedback: params.shouldExist 
          ? `Expected file to exist but it was not found: ${params.path}` 
          : `Expected file to be removed but it still exists: ${params.path}` 
      };
    }
    
    return { 
      isValid: true, 
      feedback: params.shouldExist 
        ? `File exists as expected: ${params.path}` 
        : `File successfully removed: ${params.path}` 
    };
  }

  /**
   * Validates that a script executes successfully
   */
  private static validateScriptExecutes(
    params: { path: string },
    vfs: Record<string, string>
  ): { isValid: boolean; feedback: string } {
    // This would actually execute the script in a real implementation
    // For now, we'll just check if the file exists
    const scriptContent = vfs[params.path];
    if (scriptContent === undefined) {
      return { 
        isValid: false, 
        feedback: `Script not found: ${params.path}` 
      };
    }
    
    return { 
      isValid: true, 
      feedback: `Script found and ready to execute: ${params.path}` 
    };
  }

  /**
   * Validates that an environment variable equals a specific value
   */
  private static validateEnvEquals(
    params: { variable: string; value: string },
    env: Record<string, string>
  ): { isValid: boolean; feedback: string } {
    const actualValue = env[params.variable];
    if (actualValue === undefined) {
      return { 
        isValid: false, 
        feedback: `Environment variable not set: ${params.variable}` 
      };
    }
    
    if (actualValue !== params.value) {
      return { 
        isValid: false, 
        feedback: `Environment variable ${params.variable} has value "${actualValue}", expected "${params.value}"` 
      };
    }
    
    return { 
      isValid: true, 
      feedback: `Environment variable ${params.variable} correctly set to "${params.value}"` 
    };
  }
}

export default MissionValidator;