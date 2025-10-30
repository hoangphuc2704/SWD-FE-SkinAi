import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component để chọn vấn đề da
 */
function ProblemSelector({ selectedProblem, onSelect }) {
  const problems = [
    'Mụn trứng cá và mụn đầu đen',
    'Da khô và bong tróc',
    'Da nhờn và lỗ chân lông to',
    'Nám và tàn nhang',
    'Lão hóa và nếp nhăn',
  ];

  return (
    <div className={cx('problems')}>
      <h5>Các vấn đề phổ biến:</h5>
      {problems.map((problem) => (
        <button
          key={problem}
          className={cx({ selected: selectedProblem === problem })}
          onClick={() => onSelect(problem)}
        >
          {problem}
        </button>
      ))}
    </div>
  );
}

export default ProblemSelector;

