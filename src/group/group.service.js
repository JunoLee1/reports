import { PrismaClient } from "@prisma/client"

//CORS
const prisma = new PrismaClient();

class service {
    constructor(){
        this.select = {
            name : true,
            nickname : true,
            tags : true,
            goalReps: true
        }
    }
    buildOption (choice) {
        return {...this.select, ...(choice || {})}
    } 
    getGroupList = async (req, res) => {
        const {page, take, order, search} = req.query
        
        const pageNumber = Number(page) || 1
        const limit = Number(take) || 10
        const skip = (pageNumber - 1) * limit
        
        const PageComponentsRange = (limit < 0 || skip < 0 || limit > 100 || skip > 100) 
        if( PageComponentsRange) return res.status(400).json(`plese check limit or skip `)

        const whereCondition = search ? {name:{ contains :  search }} :{}
        const sortMap = {
            like:   { likes: { _count: "desc" } },        
            latest: { createdAt: "desc" },                 
            participant: { participants: { _count: "desc" } }
        };

        const orderBy = sortMap[order] || { createdAt : "desc"}
        const finalOption = this.buildOption({like: true})
        try {   
            const groupList = await prisma.group.findMany({
                where: whereCondition,
                take : limit,
                skip, 
                orderBy,
                include:{
                    _count:{
                    select :{
                         participants : true,
                         like:true
                        }
                    }
                },
                select : finalOption 
            })
            res.status(200).json({
                data: groupList,
                message : "그룹조회 성공"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({error:" INTERNAL SERVER ERROR"})
        }
    }

    getGroup = async (req, res) => {
        const id  = req.param.groupId
        const finalOption = this.buildOption({})
        if (!isNaN(id))return 
         try {
            const unitqueGroup = await prisma.group.findUnique({
                where : id ,
                select
            })
        } catch (error) {
            
        }
    }
}