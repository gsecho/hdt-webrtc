import React from 'react'
import lodash from 'lodash'
import MeetingRow from './MeetingRow'

class MeetingGrid extends React.PureComponent {

    render(){
        // 传入的data必须有值
        const { columnCount, data } = this.props
        const spanNum = 24/columnCount;
        const gridData = [] // 栅格数据
        let rowData = [];   // 行数据
        if(!lodash.isUndefined(data)){
          for(let i=0; i< data.length; i+=1){
            rowData.push(data[i])
            if(rowData.length === columnCount){// 填满了  
                gridData.push(rowData); // 存旧的  
                rowData = [];   // 创建新的 
            }
          }
          if(data.length%columnCount !== 0){ // 有多余的没push
              gridData.push(rowData); 
          }
        }
        
        return(
          <div className="customer-meeting-grid">
            {
            gridData.map( (line, index) => 
              <MeetingRow 
                key={index}
                spanNum={spanNum}
                rowData={line}
              />
            )
            }
          </div>
        )
    }
}

export default MeetingGrid;