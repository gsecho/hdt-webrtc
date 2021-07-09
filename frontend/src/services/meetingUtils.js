/*
 * @Author: chenrf
 * @Date: 2021-05-06 10:04
 */
import lodash from 'lodash'

export function getTimeMs(){
    // 时钟从 1970 年 1 月 1 日午夜开始计算的 ms值  
    return (new Date()).getTime();
}

/**
 * 生成随机数名称
 */
export function getRandomClientName(roomId, name){
    const curMs = getTimeMs();
    const random = parseInt(Math.random()*10000, 10) + 1;
    return `${roomId}-${name}-${curMs}-${random.toString()}`; // { roomId-name-返回时间-随机数 }
}

export function formatStompData(from, to, content){
    return {
      'from': from,
      'to': to,
      'content': content,
    }
}


export function addMemberToList(member, members){
    // eslint-disable-next-line no-restricted-syntax
    for(const i in members){
        if(lodash.isEmpty(members[i])){// 是空的则加入
            // eslint-disable-next-line no-param-reassign
            members[i] = member;
            return;
        }
    }
    members.push(member)
}

export function removeMemberFromList(targetMember, members){
    const index = members.findIndex((member) => member.id === targetMember.id)
    if(index !== -1){
        const {stream} = members[index]
        if(stream){
            const tracks = stream.getTracks()
            if(tracks){
                // eslint-disable-next-line no-restricted-syntax
                for(const track of tracks){
                    track.stop()
                }
            }
        }
        members.fill({}, index, index+1)
    }
}
