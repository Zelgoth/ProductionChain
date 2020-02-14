import React, { Component } from 'react';
import { MDBCard, MDBCardBody, MDBTable, MDBTableBody, MDBTableHead, MDBRow, MDBCol } from 'mdbreact';
import { OVERCLOCK } from './logic/Calculator.js'
import data from "./data";
import Recipe from './Recipe';

class TableSection extends Component {
    state = {
        headers: data.Headers.map(h => {
            return (h.label)
        }),
        recipes: data.Recipes.map(r => {
            return r
        })
    }

    handleDelete = recipeStep => {
        const recipes = this.state.recipes.filter(r => r.step !== recipeStep);
        this.setState({ recipes });
    };

    handleOverclock = (recipeId, status) => {
        const recipes = this.state.recipes;
        recipes[recipeId].overclock = status;

        var results = OVERCLOCK(recipes[recipeId].rft, recipes[recipeId].tier, recipes[recipeId].time);
        recipes[recipeId].rftoc = results.rft;
        recipes[recipeId].timeoc = results.time;
        recipes[recipeId].efficiencyoc = 100 * (recipes[recipeId].rft * recipes[recipeId].time) / (results.rft * results.time);
        this.setState({ recipes });
    }

    render() {
        return (
            <React.Fragment>
                <MDBRow>
                    <MDBCol>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBTable responsive hover striped>
                                    <MDBTableHead color="blue lighten-4">
                                        <tr>
                                            {
                                                (this.state.headers.map((header, index) => (
                                                    <th key={"header" + index} className="align-middle text-uppercase font-weight-bold">{header}</th>
                                                )))
                                            }
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            this.state.recipes.map(recipe => (
                                                <Recipe
                                                    key={recipe.step}
                                                    step={recipe.step}
                                                    machine={recipe.machine}
                                                    tier={recipe.tier}
                                                    overclock={recipe.overclock}
                                                    rft={recipe.rft}
                                                    rftoc={recipe.rftoc}
                                                    time={recipe.time}
                                                    timeoc={recipe.timeoc}
                                                    efficiency={recipe.efficiency}
                                                    efficiencyoc={recipe.efficiencyoc}
                                                    inputs={recipe.inputs}
                                                    outputs={recipe.outputs}
                                                    onDelete={this.handleDelete}
                                                    onChange={this.handleOverclock}
                                                />
                                            ))
                                        }
                                    </MDBTableBody>
                                </MDBTable>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </React.Fragment>
        )
    }
}

export default TableSection;