import {httpStatus} from "../../utils/http_request"
class service {
  constructor() {
    this.select = {
      nickname: true,
      distance: true,
      activityType: true,
      photos: true,
      duration: true,
    };
  }
  buildOption(choice) {
    return { ...this.select, ...(choice || {}) };
  }
  getRecordList = async (req, res) => {
    const groupId = Number(req.params.groupId);
    const { nickname, page, limit, sortType } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const finalOption = this.buildOption(
      req.query.choice ? JSON.parse(req.query.choice) : {}
    );
    // prunning
    if (isNaN(page) || isNaN(take))
      return res.status(400).json({ error: "page 와 take 정수 형태 확인" });
    if (skip < 0) return res.status(400).json({ error: "skip 걊 범위 확인" });
    if (isNaN(groupId))
      return res.status(400).json({ error: "그룹 인덱스 정수 형태 확인" });

    const whereCondition = nickname ? { nickname: { contains: nickname } } : {};
    const sortMap = {
      "최신순": { createdAt: "desc" },
      "운동 시간순": { duration: "desc" },
    };
    const orderBy = sortMap[sortType] || { createdAt: "desc" };
    try {
      const groupList = await prisma.record.findMany({
        where: {
          id: groupId,
          ...whereCondition,
        },
        skip,
        take,
        orderBy: orderBy,
        select: finalOption,
      });
      return res.status(200).json({
        message: "리스트 조회 성공",
        data: groupList,
      });
    } catch (error) {
      console.error(error);
      throw new error
    }
  };

  getUniqueRecord = async (req, res) => {
    const groupId = Number(req.params.groupId);

    if (isNaN(groupId))
      return res.status(400).json({ error: "그룹인덱스 오류 확인" });

    try {
      const uniqueRecord = await prisma.record.findUnique({
        where: {
          id: groupId,
        },
        select: {
          recordTime: true,
          nickname: true,
        },
      });
      return res.status(200).json({
        message: "해당  그룹 운동기록 조회",
        data: uniqueRecord,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  };
  getRankRecordList = async (req, res) => {
    
    const groupId = Number(req.params.groupId);
    const {
      description,
      activityType,
      distance,
      nickname,
      recordTime,
      photos,
    } = req.query;

    const finalOption = this.buildOption({
      description: true,
      recordTime: true,
    });

    const distanceNumber = Number(distance);
    if (typeof nickname !== "string" || typeof activityType !== "string")
      return res.status(400).json({ error: "닉네임은 문자열만 가능합니다" });
    if (isNaN(distanceNumber) || isNaN(recordTime))
      return res
        .status(400)
        .json({ error: " 해당 카테고리는 정수 여야 합니다" });

    try {
      const rankList = await prisma.rank.findMany({
        where: {
          id: groupId,
        },
        select: finalOption,
      });
      res.status(200).json({
        message: "랭크 리스트 조회 성공",
        data: rankList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  };
}
