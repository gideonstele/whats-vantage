import styled from '@emotion/styled';

export const TableUglyStyleOverrideWrapper = styled.section`
  .ant-table-wrapper .ant-table-expanded-row-fixed {
    margin: -8px -8px;
    padding: 8px 8px;
  }

  .ant-table-wrapper .ant-table-cell,
  .ant-table-wrapper .ant-table-thead > tr > th,
  .ant-table-wrapper .ant-table-tbody > tr > th,
  .ant-table-wrapper .ant-table-tbody > tr > td,
  .ant-table-wrapper tfoot > tr > th,
  .ant-table-wrapper tfoot > tr > td {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .ant-table-wrapper .ant-table-tbody-virtual .ant-table-cell {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }
  .ant-table-wrapper .ant-table-thead th.ant-table-cell {
    text-align: center;
    vertical-align: middle;
  }

  .ant-table-wrapper .ant-table-thead th.table-cell--option .ant-table-cell-content {
    display: flex;
    justify-content: space-between;
    gap: 3px;
    position: relative;
    padding: 0;
  }

  .ant-table-wrapper .ant-table-thead th.table-cell--option .table-option-title {
    display: block;
    padding: 8px 0;
    width: calc(100% - 75px);
    text-align: center;
  }

  .ant-table-wrapper .ant-table-thead th.table-cell-left {
    text-align: left;
  }

  .ant-table-wrapper .ant-table-thead th.table-cell-right {
    text-align: right;
  }

  .ant-table-wrapper .ant-table-thead th.table-cell--option .table-option-buttons {
    display: flex;
    width: 72px;
    justify-content: flex-end;
    align-items: center;
  }

  .ant-table-wrapper .ant-table-tbody-virtual .ant-table-cell.table-cell-center {
    justify-content: center;
  }

  .ant-table-wrapper .ant-table-tbody-virtual .ant-table-cell.ant-table-selection-column {
    justify-content: center;
  }
`;
