const documentAppeal = {
  id: 1,
  document_type: 'employment_history',
  document_type_name: 'Трудовая книжка',
  status: 'created',
  status_name: 'В работе',
  created_at: '2022-12-09T11:38:52.729+03:00',
  type: 'Hr::Appeals::Document'
}

const vacationAppeal = {
  id: 2,
  vacation_type: 'without_pay',
  vacation_type_name: 'Отпуск без сохранения заработной платы',
  vacation_day_start: '2022-12-10',
  vacation_day_finish: '2022-12-11',
  vacation_days: '2',
  status: 'created',
  status_name: 'На рассмотрении',
  created_at: '2022-12-09T12:03:07.248+03:00',
  type: 'Hr::Appeals::Vacation',
  user: {
    id: '2',
    username: 'Saske',
    avatar: 'http://192.168.1.76:3000//system/users/avatar_croppeds/2022/10/28/2/main.jpeg?1667316363',
    position: 'Специалист по выращиванию огурцов',
    cinemas: [
      'Звезда'
    ]
  }
}
