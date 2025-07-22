import { saveAs } from 'file-saver'

const saverPcd = (positions) => {
  console.log(positions, 'positions')
  let header = `# .PCD v.7 - Point Cloud Data file format
VERSION .7
FIELDS x y z
SIZE 4 4 4
TYPE F F F
COUNT 1 1 1
WIDTH ${positions.length / 3}
HEIGHT 1
VIEWPOINT 0 0 0 1 0 0 0
POINTS ${positions.length / 3}
DATA ascii
`

  for (let i = 0; i < positions.length; i += 3) {
    let x = Number(positions[i]).toFixed(6)
    let y = Number(positions[i + 1]).toFixed(6)
    let z = Number(positions[i + 2]).toFixed(6)
    header += `${x} ${y} ${z}\n`
  }

  let blob = new Blob([header], { type: 'text/plain;charset=utf-8' })
  console.log(blob, 'blob')
  saveAs(blob, './output.pcd')
}

export default saverPcd
