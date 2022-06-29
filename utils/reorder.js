
//  one dimensional array reorder for data in mongoDB 

export function reorderOneDimension(original_index, target_index, arrayToChange){

    if(original_index < target_index){
    
        // Moves to the right
        // lower index move to higher position

        let changesToMake = target_index - original_index + 1;

        for(let i = 0; i < arrayToChange.length; i++){

            
            if(changesToMake === 0){
    
                break
            }

            let arrayElement = arrayToChange[i];
        
            if(arrayElement.index == original_index){
    
                arrayElement.index = target_index;
                changesToMake -= 1;
    
    
            }
            else if((arrayElement.index > original_index) && (arrayElement.index <= target_index)){
    
                arrayElement.index -= 1;
                changesToMake -= 1;
    
    
            }
        }

    }
    else if(original_index > target_index){
    
        // Moves to the left
        // higher index move to lower position

        let changesToMake = original_index - target_index + 1;

        for(let i = 0; i < arrayToChange.length; i++){

            
            if(changesToMake === 0){
    
                break
            }

            let arrayElement = arrayToChange[i];

            if(arrayElement.index == original_index){
    
                arrayElement.index = target_index;
                changesToMake -= 1;
    
    
            }
            else if((arrayElement.index >= target_index) && (arrayElement.index < original_index)){
    
                arrayElement.index += 1;
                changesToMake -= 1;
    
    
            }
        }

        // arrayToChange.forEach(task => {

        //     if(changesToMake === 0){

        //         return
        //     }
    
            
        //     if(taskIndex == original_index){
    
        //         task.index = target_index;
        //         changesToMake -= 1;

    
        //     }
        //     else if((taskIndex >= target_index) && (taskIndex < original_index)){
    
        //         task.index += 1;
        //         changesToMake -= 1;

    
        //     }
    
        // })
    
    }
}


