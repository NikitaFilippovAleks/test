import React from 'react';

import { cleanup, render, waitFor } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { apiUrls, apiWrapper } from 'config/api';

import MockAdapter from 'axios-mock-adapter';
import AllProviders from 'jest/helpers/AllProviders';
import ScreensEducationIndex from 'screens/education/Education';
import * as data from 'functions/Api';
import { courses } from 'jest/testData/education';

jest.mock('functions/Api', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: { courses },
    loading: false
  }))
}));

describe('Courses component testing', () => {
  // const mock = jest.spyOn(data, 'useFetch');
  // let apiMock: MockAdapter;
  // beforeAll(() => {
  //   apiMock = new MockAdapter(apiWrapper.axiosInstance);
  // });

  // afterEach(() => {
  //   apiMock.reset();
  // });

  it('Should render courses', async () => {
    // apiMock.onGet(apiUrls.courses.list, { params: { survey_type: 'all' } }).reply(200, () => {
    //   console.log('Hereee')
    //   return {
    //     ok: true,
    //     data: {
    //       "levels": [
    //         {
    //           "id": 1,
    //           "name": "Базовый уровень",
    //           "factor": 1.0,
    //           "available": true
    //         },
    //         {
    //           "id": 2,
    //           "name": "Уровень Профи",
    //           "factor": 2.0,
    //           "available": true
    //         },
    //         {
    //           "id": 3,
    //           "name": "Уровень Эксперт",
    //           "factor": 3.0,
    //           "available": true
    //         }
    //       ],
    //       "courses": [
    //         {
    //           "id": 172,
    //           "name": "Ягодный курс",
    //           "description": "В этом курсе вы научитесь работать с ягодами\r\n",
    //           "order_index": 0,
    //           "image_url": null,
    //           "level_id": 1,
    //           "updated_at": 1670507189,
    //           "created_at": 1665741731,
    //           "tasks": [
    //             {
    //               "id": 188,
    //               "name": "Lesson 1",
    //               "position": 1,
    //               "course_id": 172,
    //               "started_by_user": true,
    //               "finished_by_user": true,
    //               "image_url": null,
    //               "type": "lesson",
    //               "updated_at": 1670490972
    //             },
    //             {
    //               "id": 196,
    //               "name": "Вводный тест",
    //               "position": 2,
    //               "course_id": 172,
    //               "type": "survey",
    //               "updated_at": 1670507189,
    //               "version": 13,
    //               "variant": 3,
    //               "level_id": 0,
    //               "questions_count": 4,
    //               "total_time": 120,
    //               "total_score": 4,
    //               "show_answers": true,
    //               "survey_type": "test"
    //             },
    //             {
    //               "id": 189,
    //               "name": "Урок 2. Как искать ягоды в лесу",
    //               "position": 3,
    //               "course_id": 172,
    //               "started_by_user": false,
    //               "finished_by_user": false,
    //               "image_url": null,
    //               "type": "lesson",
    //               "updated_at": 1670495075
    //             },
    //             {
    //               "id": 207,
    //               "name": "Ориентирование в лесу",
    //               "position": 4,
    //               "course_id": 172,
    //               "type": "survey",
    //               "updated_at": 1670495177,
    //               "version": 5,
    //               "variant": 2,
    //               "level_id": 0,
    //               "questions_count": 2,
    //               "total_time": 120,
    //               "total_score": 2,
    //               "show_answers": true,
    //               "survey_type": "test"
    //             }
    //           ],
    //           "is_watched": false
    //         }
    //       ],
    //       "timestamp": 1670945387
    //     }
    //   }
    // });
    // console.log('apiMock.history1:', apiMock.history);
    const screen = render(<AllProviders><ScreensEducationIndex /></AllProviders>);

    // console.log('apiMock.history2:', apiMock.history);
    await waitFor(() => {
      screen.debug();
      expect(screen.getByText('Ягодный курс')).toBeDefined();
    });
    // const final = await screen.findByTestId('123');
    screen.debug();
    // expect(final).toBeDefined();
  });
});
