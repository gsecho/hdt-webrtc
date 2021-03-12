import React from 'react'
import { layerProtocolList } from '@/utils/Constants'
import styles from './portRange.less'

export default function PortRange(props) {
    const { portRange } = props;
    let rangeData = [];
    let header = 'Port';//single
    if (portRange) {
        const ranges = portRange.value.split(';')
        rangeData = ranges.reduce((total, item) => {
            if (item.length > 0) {
                const arr = item.split('|');
                total.push([layerProtocolList[Number(arr[1])].text, arr[0]]);
            }
            return total;
        }, [])

        if (portRange.type) {
            header = `Port Range`;//range
        }
    }

    return (
        <div>
            <div className={styles.portRange}>
                <div>
                    <div className={styles.row}>
                        <div>Protocol</div><div>{header}</div>
                    </div>
                    {rangeData.map((item, index) => (
                        <div className={styles.row} key={index}>
                                <span>
                                    <div >{item[0]}</div><div>{item[1]}</div>
                                </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
