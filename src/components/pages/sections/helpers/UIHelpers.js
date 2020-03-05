/**
 *A Parsing function that converts a string into
 *an item object array
 * 
 * @export
 * @param {String} raw - Input string to parse.
 * @return {array} - the parse items object array
 */
export function ParseItems(raw) {
    if (raw.endsWith(';')) {
        let newRaw = raw.slice(0, -1);
        raw = newRaw;
    }

    let list = raw.split(';');
    let items = [];
    for (let index in list) {
        let item = list[index].split(',');
        item[1].toLowerCase();
        items.push(
            {
                quantity: item[0].trim(),
                unit: item[1].trim(),
                name: item[2].trim()
            }
        )
    };
    return items;
}

export function OutputRecipes(graph, recipes) {
    recipes.forEach((recipe, node) => {
        recipe.targetMachines = graph.getNodeAttribute(node, "targetMachines");
    })

    return recipes;
}

export function CalculateRatio(recipes) {
    //Calculates the items Units/second ratio and adds it to outputs.
    recipes.forEach(recipe => {
        let step = recipe.step;
        let time = recipe.time;

        recipe.outputs.forEach(output => {
            output["ratio"] = output.quantity / time;
            output["step"] = step;
        });
    });

    return recipes;
}

export function BuildOptions(recipes) {
    //label: {item} + ' - #' + {step}, value={outputObj}
    let options = [];

    recipes.forEach(recipe => {
        recipe.outputs.forEach(output => {
            let newOption = {
                label: output.name + ' - #' + output.step,
                value: output
            }
            options.push(newOption);
        })
    })

    return options;
}