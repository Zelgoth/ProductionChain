import React, { Component } from 'react';
import data from './sections/data';
import exampleRecipes from './sections/example';
import { Overclock, GenerateRecipeGraph } from './sections/helpers/RecipeHelpers';
import { BuildOptions, CalculateRatio, OutputRecipes } from './sections/helpers/UIHelpers';
import InformationSection from './sections/InformationSection';
import SankeySection from './sections/SankeySection';
import TableSection from './sections/TableSection';

class DashboardPage extends Component {
    constructor() {
        super()
        let newState;
        if(localStorage.getItem('data')){
            newState = JSON.parse(localStorage.getItem('data'));
        }
        else{
            newState = {
                headers: data.Headers.map(headers => {
                    return (headers.label)
                }),
                recipes: CalculateRatio(exampleRecipes.Recipes),
                targets: {
                    "item": {
                        step: null,
                        name: "",
                        ratio: 0
                    },
                    "machines": 0,
                    "bps": 0,
                    "disable": true
                }
            }
        }

        this.state = newState;
    }

    handleDelete = recipeStep => {
        const state = this.state;
        state.recipes = state.recipes.filter(r => Number(r.step) !== recipeStep);

        for (let index in state.recipes) {
            state.recipes[index].step = index;
            state.recipes[index].outputs.map(output => (
                output.step = index
            ))
        }

        if (recipeStep === state.targets.item.step) {
            state.targets.item.step = null;
            state.targets.item.name = "";
            state.targets.item.ratio = 0;
            state.targets.bps = 0;
            state.targets.machines = 0;
            state.targets.disable = true;
        }

        this.setState(state);
        localStorage.setItem('data', JSON.stringify(this.state));
    };

    handleOverclock = (recipeId, status) => {
        let recipes = this.state.recipes;
        recipes[recipeId].overclock = status;

        let results = Overclock(recipes[recipeId].rft / 4, recipes[recipeId].tier, recipes[recipeId].time * 20);
        recipes[recipeId].rftoc = results.eut * 4;
        recipes[recipeId].timeoc = results.ticks / 20;
        recipes[recipeId].efficiencyoc =
            100 * (recipes[recipeId].rft * recipes[recipeId].time) /
            (recipes[recipeId].rftoc * recipes[recipeId].timeoc);

        let graph = GenerateRecipeGraph(recipes, this.state.targets);
        recipes = OutputRecipes(graph, recipes);

        this.setState({ recipes });
        localStorage.setItem('data', JSON.stringify(this.state));
    };

    handleTiers = (recipeId, status) => {
        let recipes = this.state.recipes;
        recipes[recipeId].tier = status;

        let results = Overclock(recipes[recipeId].rft / 4, recipes[recipeId].tier, recipes[recipeId].time * 20);
        recipes[recipeId].rftoc = results.eut * 4;
        recipes[recipeId].timeoc = results.ticks / 20;
        recipes[recipeId].efficiencyoc =
            100 * (recipes[recipeId].rft * recipes[recipeId].time) /
            (recipes[recipeId].rftoc * recipes[recipeId].timeoc);

        let graph = GenerateRecipeGraph(recipes, this.state.targets);
        recipes = OutputRecipes(graph, recipes);

        this.setState({ recipes })
        localStorage.setItem('data', JSON.stringify(this.state));
    };

    handleSwapDown = recipeStep => {
        if (recipeStep < this.state.recipes.length - 1) {
            let recipes = this.state.recipes;
            let currentItem = recipes[recipeStep];
            let nextItem = recipes[recipeStep + 1];

            currentItem.step = recipeStep + 1;
            currentItem.outputs.map(output => (
                output.step = recipeStep + 1
            ));

            nextItem.step = recipeStep;
            nextItem.outputs.map(output => (
                output.step = recipeStep
            ));

            recipes[recipeStep] = nextItem;
            recipes[recipeStep + 1] = currentItem;

            this.setState({ recipes });
            localStorage.setItem('data', JSON.stringify(this.state));
        }
    };

    handleSwapUp = recipeStep => {
        if (recipeStep > 0) {
            let recipes = this.state.recipes;
            let currentItem = recipes[recipeStep];
            let nextItem = recipes[recipeStep - 1];

            currentItem.step = recipeStep - 1;
            currentItem.outputs.map(output => (
                output.step = recipeStep - 1
            ));

            nextItem.step = recipeStep;
            nextItem.step = recipeStep;
            nextItem.outputs.map(output => (
                output.step = recipeStep
            ));

            recipes[recipeStep] = nextItem;
            recipes[recipeStep - 1] = currentItem;

            this.setState({ recipes });
            localStorage.setItem('data', JSON.stringify(this.state));
        }
    };

    handleAdd = newRecipe => {
        let recipes = this.state.recipes;
        let nextStep = this.state.recipes.length;

        recipes.push(
            {
                step: nextStep,
                machine: newRecipe.machine,
                tier: newRecipe.tier,
                overclock: newRecipe.overclock,
                rft: newRecipe.rft,
                time: newRecipe.time,
                efficiency: 100,
                inputs: [...newRecipe.inputs],
                outputs: [...newRecipe.outputs]
            }
        );

        recipes = CalculateRatio(recipes);

        this.setState({ recipes });
        localStorage.setItem('data', JSON.stringify(this.state));
    };

    handleSettingChange = (update, type = "name") => {
        let targets = this.state.targets;
        if (targets.item.name === "") {
            if (type === "name") {
                targets.item.name = update;
                targets.item.ratio = update.ratio;
                targets.item.step = update.step;
                targets.machines = 1;
                targets.bps = 1 * targets.item.ratio;
                targets.bps = targets.bps.toFixed(2);
                targets.disable = false;
            }
        }
        else if (type === "name") {
            targets.item.name = update;
            targets.item.ratio = update.ratio;
            targets.item.step = update.step;
            targets.machines = 1;
            targets.bps = targets.machines * targets.item.ratio;
            targets.bps = targets.bps.toFixed(2);
        }
        else if (type === "machine") {
            if (update <= 0) {
                targets.machines = 0;
                targets.bps = 0;
            }
            else {
                targets.machines = update;
                targets.bps = targets.machines * targets.item.ratio;
                targets.bps = targets.bps.toFixed(2);
            }
        }
        else {
            if (update <= 0) {
                targets.bps = 0;
                targets.machines = 0;
            }
            else {
                targets.bps = update;
                targets.machines = update / targets.item.ratio;
                targets.bps = targets.bps.toFixed(2);
            }
        }

        this.setState({ targets });
        let recipes = this.state.recipes;
        recipes[targets.item.step].targetMachines = targets.machines;
        let graph = GenerateRecipeGraph(this.state.recipes, this.state.targets);
        recipes = OutputRecipes(graph, this.state.recipes);
        this.setState({ recipes });
        localStorage.setItem('data', JSON.stringify(this.state));
    };

    render() {
        return (
            <React.Fragment>
                <InformationSection
                    outputs={BuildOptions(this.state.recipes)}
                    targets={this.state.targets}
                    handleSettingChange={this.handleSettingChange}
                />
                <TableSection
                    headers={this.state.headers}
                    recipes={this.state.recipes}
                    handleDelete={this.handleDelete}
                    handleTiers={this.handleTiers}
                    handleOverclock={this.handleOverclock}
                    handleSwapDown={this.handleSwapDown}
                    handleSwapUp={this.handleSwapUp}
                    handleAdd={this.handleAdd}
                    handleMachineSetting={this.handleMachineSetting}
                />
                <SankeySection recipes={this.state.recipes} targets={this.state.targets} />
            </React.Fragment>
        )
    } changes
}

export default DashboardPage;