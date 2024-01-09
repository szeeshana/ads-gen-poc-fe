export const STATUSES = {
    draft :{
        color: '#d2b07d'
    },
    pending :{
        color: '#e28528'
    }, 
    in_progress :{
        color: 'blue'
    }, 
    first_stage_completed :{
        color: 'blue'
    }, 
    second_stage_in_progress :{
        color: 'blue'
    }, 
    completed :{
        color: '#00a76f'
    },
    failed :{
        color: '#ec0606'
    }

}


export const ENQUEUESNACKBAR_MSG_FOR_JOB = {
    job_in_progress: {
        message:'In progress'
    },
    first_stage_description_created: {
        message:'First stage description created'
    },
    first_stage_image_created: {
        message:'First stage image created'
    },
    first_stage_completed: {
        message:'First stage completed'
    },
    first_stage_failed: {
        message:'First stage failed'
    },
    second_stage_in_progress: {
        message:'Second stage in progress'
    },
    second_stage_description_created: {
        message:'Second stage description created'
    },
    second_stage_image_created: {
        message:'Second stage image created'
    },
    second_stage_failed: {
        message:'Second stage failed'
    },
    second_stage_completed: {
        message:'Second stage failed'
    },
}