export const deleteData = async (endpoint)=>{
    const c= confirm("Are you suer to delete this data");
    if(c){
        try{
            const response = await fetch(endpoint,
                {
                    method:"delete",
                    credentials:"include"
                }
            );
            const data = await response.json();
            console.log("data ",data)
            if(!response.ok){
                throw new Error(response.statusText);
            }
            return true;

        }catch(error){
            return false;
        }
    }else{
        false;
    }
}