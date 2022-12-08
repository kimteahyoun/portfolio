import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'

const MySellList = ({ location }) => {
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [sellList, setSellList] = useState(['aaa']);
    const [total, setTotal] = useState(1);
    const page = parseInt(search.page) || 1;
    const callSellList = async () => {
        const result = await axios.get(`/api/tradeinfo/buylist?buyer=${loginUser.unickname}?page=${page}`)
        setSellList(result.data.list);
        setTotal(result.data.total);
    }

    useEffect(() => {
        callSellList();
    }, [])
    return (
        <div>
         <Table striped className='mt-5'>
        <thead>
          <tr >
            <th>후기내용</th>
            <th>보낸사람</th>
            <th>작성일자</th>
            <th>평점</th>

          </tr>
        </thead>
        <tbody>
          {list.map(list =>
            <>
              <tr key={list.rvcode}>
                <td>{list.rvcontent}</td>
                <td>{list.sender}</td>
                <td>{list.regDate}</td>
                <td>  <Rating
                  emptySymbol="fa fa-star-o fa-2x"
                  fullSymbol="fa fa-star fa-2x"
                  value={list.point}
                  readOnly
                  fractions={5} precision={0.5} max={5} /></td>
              </tr>

            </>
          )}
        </tbody>
      </Table>
            {sellList.length !== 0 ? <Pagination
                activePage={page}
                itemsCountPerPage={6}
                totalItemsCount={total}
                pageRangeDisplayed={10}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e) => history.push(`/pboard/list?page=${e}`)}
            /> : <div style={{ marginTop: 200 }}>
                <h1 style={{ fontSize: 60, color: 'red' }}>해당 검색 결과가 존재하지 않습니다.</h1>
            </div>}
        </div>


    )
}

export default MySellList