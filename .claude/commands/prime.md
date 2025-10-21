# Context Priming Each Session 

## 1. Use `think` Tool to Minimize LLM Limitations 

  * **Native `think` or `sequential_thinking` Model Context Protocol server**
    + Tool use between thoughts; plan ahead and review work 
    + Maintain project state for across AI instance flow
  
## 2. Check & Updating Project State with `memory` Tool** 

  * **Use native `memory` tool or `memory` Model Context Protocol server** 
    + `memory` MCP server project state already started 
      - Search exact entity term `generalist-portfolio` 
      - Read last update or two to understand project 
    
  * **Add entry milestones that maintain context even if suddenly disconnected** 
    + Add what you would need to easily jump into the project if connection suddenly dropped 
    + Be explicit and lay out next step details regularly 
      - What you're about to do 
      - Detail what comes after that
    + Update after completing each step 
      - How did things go and what was accomplished 
      - What does this mean for the next steps 
    + Something atypical or notable occur? 
      - Pause and update mid-task 
      - When it has implications for rest of process 
      - When planning changes and major decisions are made 

## 3. Use `read_multiple_files` for All Important Files 

  * **Use Native `read_file` or `read_multiple_files` tool**
    + Read listed important files when starting a new session 
    + Always read these files carefully and in full 
    + Total token sum of all important documents is *32,754 tokens*
      
  * **Important files include** 
    + Claude Code SPEC `/Users/seanivore/Development/360-design/assets/docs/home_entry_pages_spec.md` *17,217 tokens*
      - Your structured guide 
      - All that musts be done 
    + Architecture `/Users/seanivore/Development/360-design/assets/docs/ARCHITECTURE.md` *4,742 tokens*
      - Deeper details needed for building 
      - Reference for better understanding of process, requirements, etc. 
    + JSON entry file template `/Users/seanivore/Development/360-design/assets/docs/_entry_template.json` *1,452 tokens*
      - To understand what each project entry includes 
      - Template provides details for each value 
      - Find actual project entry JSON files here in `./assets/entries/...`
      - 15 entries totaling 22,723 tokens 
    + Read one actual JSON project entry `/Users/seanivore/Development/360-design/assets/entries/uid-dff-987.json` *1,952 tokens*
      - Fully understand what each HTML template will need 
      - Help visual design by understanding contents and visuals 
    + Planning document `/Users/seanivore/Development/360-design/assets/docs/SPEC.md` *4,201 tokens*
      - Original sketch for this website build 
      - Helpful for illustrative understanding of project 
    + Playwright Browser Automation Skills via Claude Code Plugin 
      `/Users/seanivore/.claude/plugins/marketplaces/playwright-skill/skills/playwright-skill/SKILL.md` *3,190 tokens* 
      - Referenced throughout for testing and validation 
      - Included emphasis on agentic design perfecting loop 