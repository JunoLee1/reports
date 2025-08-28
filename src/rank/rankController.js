import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * 운동 기록 랭크 조회
 
 * /group/:groupId/rank

    req.params => groupId

 * 운동 기록이 많은 순으로 월간 주간 랭크기록
        req.query => duration
 * 닉네임,누적시간, 순위, 참여자수 조회 가능
 */
class rankController {
    // 월간 주간을 계산하는 함수
    getRange(rangeType){
        // 오늘 기준으로 지난주 조회
        const today = new Date();
        // 기준 타입  === 주간
        if (rangeType === "WEEKLY"){
            const dayOfWeek = today.getDay// 
            const lastWeekStart = new Date(today)
            lastWeekStart.setDate(today.getDate() - (dayOfWeek === 0 ? 6: dayOfWeek - 1))
            lastWeekStart.setHours(0,0,0,0)

            const lastWeekEnd = new Date(start)
            lastWeekEnd.setDate(start.getDate + 6);
            lastWeekEnd.setHours(23, 59, 59, 999);

            return {lastWeekStart, lastWeekEnd}

            // 기준타입 === 월간
        } else if(rangeType === "MONTHLY"){
            return {
                lastWeekstart : new Date(today.getFullYear(), today.getMonth(), 1),
                lastWeekEnd : new Date(today.getFullYear(), today.getMonth() + 1, 0 , 23, 59, 59, 999)
            }
        }
        throw new Error("invalid range tyoe")
    }

    // 순위 계산하는 함수
    async fetchRank(){
        // 그룹에 있는 모든 참가자의 기록 조회
        const records = await prisma.record.findMany({
            where : {
                id: authorId,
                createdAt:{gte:lastWeekStart, lte: lastWeekEnd
                }
            },
            includes:{
               author : true 
            }
        })
        // 해당 그룹내에 랭킹 매핑시켜주기// 운동량이 많은 순으로 정렬
        records.forEach((rec) => {
            const pid = rec.authorId;
            if (!records_map[pid]) {
                records_map[pid] = {
                authorId: pid,
                nickname: rec.author.nickname,
                recordTime: 0,
                recordCount: 0,
                };
            }
            records_map[pid].recordCount += 1;
            console.log(rec.duration);
            records_map[pid].recordTime += rec.duration;
        });
        const rankList = Object.values(records)
            .sort((a , b) => b.recordCount - a.recordCount)
            .map((g, idx) => ({...g, rank: idx + 1 }))
            return rankList
    }
    
    // api 함수
    getRankList = async (req, res) => {
        const groupId = Number(req.params.groupId)
        if(!groupId || isNaN(groupId)) throw new Error("유효하지 않는 그룹 인덱스 값")
        
        const duration = req.query.duration || "WEEKLY"
        if(typeof duration !== "string") throw new Error("유효하지않는 기간 값")
        
        const [WEEKLY , MONTHLY] = promise.all([])
    }
}
export default  rankController();