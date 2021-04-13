import React from 'react'
import {Row, Col, Card, Button} from 'antd'

class MeetingRow extends React.PureComponent {

    render(){
        const { spanNum, rowData } = this.props
        // spanNum一列占用多少个栅格 
        return(
          <Row gutter={[16, 16]}>
            {
                rowData.map(line=>
                    // eslint-disable-next-line no-unused-expressions
                  <Col span={spanNum} key={line.id}>
                    <Card 
                      title={line.subject}
                      actions={[
                        <Button block style={{border: '0px', height: 42 }}>进入会议</Button>,
                        ]}
                    >
                      <p>{line.content}</p>
                    </Card>
                  </Col>
                )
            }
          </Row>
        )
    }
}

export default MeetingRow;